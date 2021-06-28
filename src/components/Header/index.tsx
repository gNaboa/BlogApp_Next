import styles from './header.module.scss'
import Link from 'next/link'

export default function Header() {
  return(
    <header className={styles.container}>
       <Link href="/">
         <div>
        
          <img src="/images/Logo.svg" alt="logo" />
          
      </div>
      </Link>
    </header>
   
  )
}
