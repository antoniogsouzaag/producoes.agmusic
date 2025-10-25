'use client'

// 1. Importações essenciais: useState, useEffect e createPortal
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom' 

interface MusicManagerProps {
  onUploadSuccess: () => void
}

export default function MusicManager({ onUploadSuccess }: MusicManagerProps) {
    // 2. Estados do Componente
    const [isOpen, setIsOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [title, setTitle] = useState('')
    const [artist, setArtist] = useState('Antônio Garcia')
    const [file, setFile] = useState<File | null>(null)
    const [coverImage, setCoverImage] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    
    // 3. Estado do Portal (Necessário para Next.js)
    const [mounted, setMounted] = useState(false) 

    // 4. Efeito para garantir que o Portal encontre o #modal-root no lado do cliente
    useEffect(() => {
        setMounted(true)
    }, [])
  
    // 5. Funções de Manipulação
    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setCoverImage(file)
        
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setCoverPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setCoverPreview(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!file) {
            alert('Por favor, selecione um arquivo de áudio')
            return
        }

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('title', title)
            formData.append('artist', artist)
            if (coverImage) {
                formData.append('coverImage', coverImage)
            }

            const response = await fetch('/api/music/upload', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (response.ok) {
                alert('Música adicionada com sucesso!')
                setTitle('')
                setArtist('Antônio Garcia')
                setFile(null)
                setCoverImage(null)
                setCoverPreview(null)
                setIsOpen(false)
                onUploadSuccess()
            } else {
                alert(data.error || 'Erro ao adicionar música')
            }
        } catch (error) {
            console.error('Upload error:', error)
            alert('Erro ao adicionar música')
        } finally {
            setIsUploading(false)
        }
    }

    // 6. Variável que contém o JSX COMPLETO do modal
    const modalJSX = (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Adicionar Nova Música</h3>
                    <button onClick={() => setIsOpen(false)} className="modal-close">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="upload-form">
                    <div className="form-group">
                        <label htmlFor="title">Título da Música</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Minha Música"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="artist">Artista</label>
                        <input
                            id="artist"
                            type="text"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            placeholder="Ex: Antônio Garcia"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="coverImage">Foto de Capa (Opcional)</label>
                        <input
                            id="coverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                        />
                        {coverPreview && (
                            <div className="cover-preview">
                                <img src={coverPreview} alt="Preview da capa" />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="file">Arquivo de Áudio (MP3, WAV, etc.)</label>
                        <input
                            id="file"
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            required
                        />
                        {file && (
                            <div className="file-info">
                                <i className="fas fa-music"></i>
                                <span>{file.name}</span>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-full"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <><i className="fas fa-spinner fa-spin"></i> Enviando...</>
                        ) : (
                            <><i className="fas fa-upload"></i> Enviar Música</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );

    // 7. Encontra o elemento DOM se o componente já estiver montado
    const modalRoot = mounted ? document.getElementById('modal-root') : null;


    return (
        <>
            {/* Botão de gatilho */}
            <button 
                onClick={() => setIsOpen(true)} 
                className="btn btn-primary"
                style={{ marginBottom: '2rem' }}
            >
                <i className="fas fa-plus"></i> Adicionar Música
            </button>

            {/* 8. O Portal só renderiza se estiver aberto E o modalRoot for encontrado */}
            {isOpen && modalRoot && createPortal(modalJSX, modalRoot)}
        </>
    )
}