import { GetStaticProps } from 'next';
import {format} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client'
import Link from 'next/link'
import {RichText} from 'prismic-dom'
import commonStyles from '../styles/home.module.scss'
import {FiCalendar,FiUser,FiTag, FiLink} from 'react-icons/fi'
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}
 export default function Home({postsPagination}:HomeProps) {

     const {results,next_page} = postsPagination
   
     return(
      
      <main className={styles.container}>
       
        <div className={styles.content}>
      
            {postsPagination.results.map(post=>(
             <div  key={post.uid} className={styles.card}>
               <Link href={`/post/${post.uid}`}>
                  <a>{post.data.title}</a>
                 </Link>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.bottom}>
                      <p><FiCalendar/> {post.first_publication_date}</p>
                      <p><FiUser/> {post.data.author}</p>
                  </div>
            </div>
            ))}
           
          <p className={styles.button}>Carregar mais posts</p>
        </div>
    
      </main>
     )
 }



 export const getStaticProps:GetStaticProps = async () => {
   const prismic = getPrismicClient();

 const postsResponse = await prismic.query(
   Prismic.predicates.at('document.type','posts'),
   {
     fetch:['posts.title','posts.subtitle','posts.author','posts.banner'],
     pageSize: 100
   }
   );
   console.log(JSON.stringify(postsResponse,null,2))
   const {next_page} = postsResponse

  const results = postsResponse.results.map(post=>{
    return({
      uid:post.uid,
       first_publication_date:format(
        new Date(post.first_publication_date),
        'd MMM y',
        {
          locale: ptBR,
        }
      ),
        data:{
          title:post.data.title,
          subtitle:post.data.subtitle,
          author:post.data.author
      }
            
    })
  })

   return{
     props:{
        postsPagination:{results,next_page}
     }
   }



 }
