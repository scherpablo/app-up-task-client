const LinkifiedText = ({ text, className }: { text: string; className?: string }) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(linkRegex)

    const renderPart = (part: string, index: number) => {
        if (index % 2 === 1) {
            return <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-fuchsia-600 hover:underline break-all">{part}</a>
        }
        return <span key={index}>{part}</span>
    }

    return (
        <p className={`break-words ${className ?? ''}`}>
            {parts.map(renderPart)}
        </p>
    )
}

export default LinkifiedText