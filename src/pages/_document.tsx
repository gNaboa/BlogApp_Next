import Document,{Head,Main,NextScript,Html} from 'next/document';

export default class MyDocument extends Document {
    render(){
      return(
          <Html>
            <Head>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
             <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet"/>
                <title>Blog</title>
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
      )
      
   }
}
