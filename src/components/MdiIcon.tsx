"use client";

// Componente simples que renderiza ícones MDI usando apenas CSS
// Aceita códigos como "mdi-cog-outline" e renderiza via font

interface MdiIconProps {
  icon: string; // código MDI como "mdi-cog-outline"
  className?: string;
  size?: number;
}

export function MdiIcon({ icon, className = "", size = 24 }: MdiIconProps) {
  // Se for emoji ou não começar com mdi-, renderiza como texto normal
  if (!icon.startsWith("mdi-")) {
    return <span className={className} style={{ fontSize: size }}>{icon}</span>;
  }

  return (
    <i 
      className={`mdi ${icon} ${className}`}
      style={{ fontSize: size }}
      aria-hidden="true"
    />
  );
}
