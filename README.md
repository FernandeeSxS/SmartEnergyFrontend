# SmartEnergy - Frontend

O frontend do **SmartEnergy** é uma aplicação web desenvolvida em **React**, utilizando o template **Horizon UI** como base visual e de componentes. Esta camada permite a interação do utilizador com a plataforma, incluindo autenticação, visualização de consumos, gestão de dispositivos e acesso a métricas energéticas, garantindo uma experiência de utilização moderna e responsiva.

O Backend está desenvolvido em: https://github.com/IPCALESI2526/tp02-27960_27961

---

## Estrutura do Projeto

A aplicação está organizada em pastas claras e modulares para facilitar manutenção e escalabilidade:

- **components**: Componentes reutilizáveis, organizados em subpastas como `card`, `charts`, `dropdown`, `navbar`, `sidebar` e `widget`.  
- **views**: Páginas da aplicação, divididas em `admin` e `auth`.  
  - `admin`: `dashboard`, `devices`, `deviceinfo` e `profile`.  
  - `auth`: `SignIn` e `SignUp` para autenticação.  
- **services**: Lógica de comunicação com a API RESTful. O ficheiro `api.js` define o `API_BASE_URL` e a função `apiRequest`, que envia requisições HTTP com JWT e trata respostas do servidor.  
- **assets, layouts, variables**: Recursos estáticos, configurações visuais e definições de gráficos para dashboards.  
- **Ficheiros principais**:  
  - `App.jsx` e `routes.js`: Gerem a navegação entre páginas.  
  - `index.js`: Bootstrapping da aplicação.

---

## Comunicação com a API RESTful

O frontend comunica com a **REST API** através da função `apiRequest` (`src/services/api.js`).  
Funcionalidades principais:

- Definir método HTTP (`GET`, `POST`, `PUT`, `DELETE`).  
- Enviar dados em JSON (ex.: credenciais de login ou registo de consumos).  
- Incluir token JWT no header `Authorization` para endpoints protegidos.  
- Tratar erros de forma uniforme, apresentando mensagens claras ao utilizador.

**Exemplo de requisição de login:**

```javascript
const data = await apiRequest("/Auth/login", "POST", { email, password });
if (data.token) {
  localStorage.setItem("userToken", data.token);
  window.location.href = "/admin/default";
}
```

## Páginas e Funcionalidades Principais

- **Autenticação**: `SignIn.jsx` e `SignUp.jsx` permitem registo, login e armazenamento local do JWT.  

- **Dashboard e Visualização de Dados**: Gráficos e métricas de consumo energético, com dados da REST API e serviços externos (ex.: API de preços de energia).  

- **Gestão de Dispositivos e Espaços**: Adicionar, editar e remover dispositivos, associar consumos a espaços físicos e aceder a informações detalhadas de cada equipamento.  

---

## Integração com o Backend

O frontend integra-se diretamente com a REST API do SmartEnergy, consumindo endpoints para:

- Autenticação e registo de utilizadores  
- Gestão de consumos  
- Gestão de dispositivos  
- Consulta de preços de energia  

O uso do **JWT** garante que apenas utilizadores autenticados podem aceder a dados protegidos. A função `api.js` abstrai a complexidade das chamadas HTTP e uniformiza as requisições.  

---

## Tecnologias Utilizadas

- React  
- Horizon UI  
- REST API  
- JWT para autenticação  

---

## Instalação e Compilação de toda a plataforma

1. Clonar o repositório Backend:
```bash
git clone https://github.com/IPCALESI2526/tp02-27960_27961.git
```
2. Abrir a solução `SmartEnergy.sln` no Visual Studio.
3. Clicar em **Executar** (F5) para iniciar o backend e o SOAP Service.
4. Clonar o repositório Frontend:
```bash
git clone https://github.com/FernandeeSxS/SmartEnergyFrontend.git
```
5. Instalar dependências:
```bash
npm install
```
6. Iniciar a aplicação:
```bash
npm start
```
> A aplicação estará disponível em http://localhost:3000.

### Figma Version

Horizon UI is available in Figma format as well! Check it out on Figma
Community! 🎨
[See the Horizon UI Figma design files](https://bit.ly/horizon-figma)

### Copyright and license

⭐️ [Copyright 2023 Horizon UI ](https://www.horizon-ui.com/?ref=readme-horizon-tailwind-react)

📄 [Horizon UI License](https://www.simmmple.com/licenses?ref=readme-horizon-tailwind-react)
