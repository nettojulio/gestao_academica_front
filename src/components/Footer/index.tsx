import style from './footer.module.scss'
import Image from 'next/image'
import logo_ufape from '../../../../public/logo_ufape.svg'

function Footer() {
    return (
       <div className={style.footer}>
            <div className={style.footer__logo_sementes}>
                <Image src="/logoSistema.svg" alt="Logo Coppabacs" width={250} height={50}/>
            </div>
            <div className={style.footer__logo_lmts}>
                <Image src="/logoUfape.svg"  alt="Logo ufape" width={58} height={58}/>
                <Image src="/logoLMTS.svg" alt="Logo App" width={99} height={42}/>  
            </div>
            <div className={style.footer__social}>
                <a href="#">
                    <Image src="/facebookIcon.svg" alt="Facebook Icon" width={24} height={24}/>
                </a>
                <a href="#">
                    <Image src="/instagramICon.svg" alt="Instagram Icon" width={27} height={26}/>
                </a>
                <a href="#">
                    <Image src="/gmailIcon.svg" alt="Email Icon" width={24} height={24}/>
                </a>
            </div>
       </div>
    );
}


export default Footer;