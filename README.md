<p align="center">
  <img src="construct-diary/assets/image.png" alt="Logo do Projeto" width="220" style="border-radius: 100%;" />
</p>
# Diário de Obra - Aplicativo Mobile

Aplicativo móvel multiplataforma desenvolvido em **React Native** com **Expo** e integrado ao **Supabase** (Backend-as-a-Service), projetado especificamente para engenheiros, mestres de obras e equipes de construção civil registrarem o andamento diário de suas obras de forma simples, organizada e totalmente otimizada para o plano gratuito.

---

## 🏗️ Arquitetura do Projeto

O aplicativo segue o padrão arquitetural **MVVM (Model-View-ViewModel)** adaptado para o ecossistema React Native, separando responsabilidades entre a interface de utilizador (Views), a gestão de estados e regras de negócio (ViewModels) e a persistência de dados (Supabase Services).

```text
src/
├── services/        # Comunicação com Supabase, Storage, Excel e utilitários de limpeza
├── viewmodels/      # Hooks customizados contendo toda a lógica de negócio e estados
└── views/         # Componentes de tela 
```

### Pilhas Tecnológicas
* **Frontend:** React Native, Expo SDK, Expo Router / React Navigation, Vector Icons (`@expo/vector-icons`).
* **Backend & Banco de Dados:** Supabase (PostgreSQL + Row Level Security - RLS).
* **Armazenamento de Mídia:** Supabase Storage (`fotos_diario`).
* **Compilação e Distribuição:** EAS Build (Expo Application Services) para geração de APKs Android nativos.

---

## 🚀 Funcionalidades Principais

1. **Gestão de Projetos de Construção:**
   * Criação, edição e listagem de obras/projetos individuais.
   * Gestão protegida com isolamento por utilizador autenticado.

2. **Diário de Obra Inteligente:**
   * Registo diário contendo equipes de colaboradores (com controlo de faltas e avisos), descrições de serviços executados, observações e fotografias.
   * **Memória Individual por Projeto:** Ao criar um novo diário, o sistema verifica automaticamente o diário imediatamente anterior daquele projeto e pergunta se deseja reutilizar a configuração da equipa anterior, poupando tempo em campo.

3. **Multimédia e Exportação:**
   * Captura de fotos via câmara ou galeria com upload otimizado e compressão para o Supabase Storage.
   * Exportação de dados do diário diretamente para ficheiros Excel.

4. **Otimização de Custos (Plano Gratuito Supabase):**
   * **Rotina de Limpeza Automática:** Sempre que o utilizador abre o aplicativo na tela inicial (`HomeScreen`), um serviço em segundo plano verifica e apaga diários com mais de **10 dias**, removendo em simultâneo os ficheiros de imagem associados no Supabase Storage para evitar estouro de limite de armazenamento, mantendo os dados dos projetos principais intactos.


---

## ⚙️ Como Configurar e Utilizar

Se deseja clonar este repositório e colocar o aplicativo a rodar no seu ambiente ou gerar novos pacotes de instalação, siga os passos abaixo:

### 1. Pré-requisitos
* Node.js instalado na máquina.
* Conta configurada na [Expo](https://expo.dev/).
* Projeto criado no [Supabase](https://supabase.com/).

### 2. Instalação
Clone o repositório e instale as dependências:
```bash
git clone <url-do-repositorio>
cd nome-do-projeto
npm install
```

### 3. Configuração de Variáveis de Ambiente
Crie um ficheiro `.env` na raiz do projeto (ele é ignorado pelo Git por motivos de segurança) e adicione as suas chaves do Supabase:
```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase_aqui
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase_aqui
```

### 4. Executando Localmente
Para testar utilizando o Expo Go no seu telemóvel:
```bash
npx expo start
```

### 5. Gerando APK para Distribuição (EAS Build)
Para compilar o aplicativo em formato `.apk` para Android e enviá-lo para testes externos:
1. Instale a ferramenta CLI do EAS:
   ```bash
   npm install -g eas-cli
   ```
2. Configure as variáveis seguras na nuvem da Expo (caso utilize o EAS Build):
   ```bash
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "sua_url"
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sua_chave"
   ```
3. Dispare o comando de compilação em formato APK:
   ```bash
   eas build -p android --profile preview
   ```

   <p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
</p>