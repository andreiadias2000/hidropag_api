import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carrega as variáveis do seu arquivo .env
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltando SUPABASE_URL ou SUPABASE_KEY no .env');
  process.exit(1);
}

// Inicializa o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function rodarTeste() {
  console.log('Iniciando teste de conexão com o Supabase...');

  // Cria um arquivo de texto em memória para simular o upload
  const conteudoArquivo = Buffer.from('Este é um arquivo de teste gerado pelo VS Code para testar o Storage.');
  const nomeArquivo = `teste-upload-${Date.now()}.txt`;

  console.log(`Tentando fazer upload do arquivo: ${nomeArquivo}`);

  // Faz o upload para o bucket 'notas_fiscais'
  const { data, error } = await supabase.storage
    .from('pdf')
    .upload(nomeArquivo, conteudoArquivo, {
      contentType: 'text/plain',
    });

  if (error) {
    console.error('❌ Erro no upload:', error.message);
    return;
  }

  console.log('✅ Upload concluído com sucesso!');
  console.log('Caminho salvo:', data.path);

  // Como o bucket é privado, geramos uma URL assinada temporária (válida por 1 hora) para você testar o acesso
  const { data: urlData, error: urlError } = await supabase.storage
    .from('pdf')
    .createSignedUrl(nomeArquivo, 3600); 

  if (urlError) {
    console.error('❌ Erro ao gerar URL de acesso:', urlError.message);
  } else {
    console.log('\n🔗 URL temporária para visualizar o arquivo (clique no link):');
    console.log(urlData?.signedUrl);
  }
}

rodarTeste();