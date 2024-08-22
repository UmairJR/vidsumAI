import React from 'react'
import { socials } from '../constants/social'

const Footer = () => {
    return (
        <footer className="footer bg-neutral text-neutral-content items-center p-4">
            <aside className="grid-flow-col items-center">
                
                <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
            </aside>
            <nav className="grid-flow-col gap-4 md:place-self-center items-center md:justify-self-end">
                {socials.map((social) => (
                    <a key={social.name} href={social.link} target="_blank" rel="noreferrer">
                        <img
                            key={social.name}
                            src={social.url}
                            alt={social.name}
                            className="w-[24px] h-[24px] object-contain cursor-pointer"
                        />
                    </a>
                ))}
            </nav>
        </footer>
    )
}

export default Footer