import fs from 'fs';
import path from 'path';

export async function getStaticProps() {
  const htmlPath = path.join(process.cwd(), 'public', 'frotiq_completo.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  return {
    props: {
      htmlContent,
    },
    revalidate: 3600,
  };
}

export default function Home({ htmlContent }) {
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
}
