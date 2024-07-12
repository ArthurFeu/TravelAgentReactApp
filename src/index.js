import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client'; // Importar createRoot corretamente
import './index.css';
import reportWebVitals from './reportWebVitals';
import api from './Api';

function Greeting() {
  return (
    <div>
      <h1 className="big_text">Olá, eu sou seu agente de viagens!</h1>
      <p className="long_text">Bem-vindo ao nosso site de viagens inteligente! Explore o mundo com facilidade usando nossa API avançada de agente de viagens, alimentada por inteligência artificial. Obtenha informações detalhadas sobre destinos, eventos, preços de passagens e muito mais, tudo em linguagem natural. Descubra uma nova maneira de planejar suas viagens com precisão e facilidade.</p>
      <p className="long_text">No campo abaixo digite quando e para onde você quer viajar, além de seu local de partida.</p>
    </div>
  );
}

const useApiCall = (query) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    let question = `${query} Quero que faça um roteiro de viagem para mim com eventos que irão ocorrer na data da viagem e com preço de passagens saindo de São Paulo OU do local dito anteriormente. Coloque o valor das passagens em Real e ida e volta. Também quero saber restaurantes, pontos turísticos e eventos culturais que ocorrerão na data da viagem. Fale sobre o clima tambem por favor.`;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.post('', { question: question });

        console.log('API response:', response);

        if (response.status !== 200) {
          console.error('HTTP error:', response);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setData(response.data);
      } catch (error) {
        setError(error);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  console.log('Data:', data);

  return { data, loading, error };
};

function InsertQuery() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const { data, loading, error } = useApiCall(submittedQuery);

  const handleSendQuery = () => {
    setSubmittedQuery(query);
    setQuery(''); // Limpar o campo de entrada após enviar
  };

  return (
    <div className='container'>
      <div className="wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Quero viajar para..."
        />
        <button onClick={handleSendQuery}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"
            viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
            strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M5 12l14 0"></path>
            <path d="M13 18l6 -6"></path>
            <path d="M13 6l6 6"></path>
          </svg>
        </button>
      </div>
      <br />
      {loading && <p className="api_response">Aguarde um instante, por favor!</p>}
      {error && <p className="api_response">Erro inesperado: {error.message}</p>}
      <PrintValues value={data} />
    </div>
  );
}

function PrintValues({ value }) {
  // Verificar se 'value' é um objeto antes de tentar acessar seus campos
  if (!value || typeof value !== 'object' || !value.details) {
    return null;
  }

  // Extrair o texto principal formatado
  let roteiro = value.details;
  // Substituir **texto** por <strong>texto</strong>
  roteiro = roteiro.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Adicionar quebras de linha apenas antes dos números que indicam novas seções
  roteiro = roteiro.replace(/(^|\n)\d+\.\s/g, '$1<br><br>$&');

  // Adicionar quebras de linha após cada item listado
  roteiro = roteiro.replace(/-\s/g, '<br> - ');

  // Adicionar espaço após £ para separar o símbolo da quantidade
  roteiro = roteiro.replace(/£/g, '£ ');
  roteiro += '<br>';

  return (
    <div className="long_text" dangerouslySetInnerHTML={{ __html: roteiro }}></div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className='container'>
      <Greeting />
      <InsertQuery />
    </div>
  </React.StrictMode>
);

reportWebVitals();
