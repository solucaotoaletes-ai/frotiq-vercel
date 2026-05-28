import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Se em produção, redireciona para o HTML
  }, []);

  return (
    <iframe
      src="/index.html"
      style={{
        width: '100%',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
      }}
      title="FROTIQ"
    />
  );
}
