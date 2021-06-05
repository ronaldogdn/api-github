import api from './api';

class App {
    constructor() {
        //lista de repositórios
        //this.repositorios = [];
        this.repositorios = JSON.parse(localStorage.getItem('repositorios')) || [];
        //pega o formulário
        this.formulario = document.querySelector('form');
        //lista
        this.lista = document.querySelector('.list-group');
        //registra os eventos do form
        this.registrarEventos();
        this.renderizarTela();
        
    }
    registrarEventos() {
        //no submit do form recebe um evento
        this.formulario.onsubmit = evento => this.adicionarRepositorio(evento);
    }
    async adicionarRepositorio(evento) {
        //evita que o form recarregue a página
        evento.preventDefault();
        //recupera o valor do input
        let input = this.formulario.querySelector('input[id=repositorio]').value;
        //se o input estiver vazio sai da aplicação
        if (input.lenght === 0) {
            return;
        }
        this.apresentarBuscando(input);
        try {
            let response = await api.get(`/repos/${input}`);
            let { name, description, html_url, owner: { avatar_url } } = response.data;
            //adiciona o repositório na lista
            this.repositorios.push({
                nome: name,
                descricao: description,
                avatar_url,
                link: html_url,
            });
            //renderizar a tela
            this.renderizarTela();
            this.salvarDadosStorage();
        }
        catch (erro) {
            //se tiver um carregando remove ele
            this.lista.removeChild(document.querySelector('.list-group-item-warning'));
            let er = document.querySelector('.list-group-item-danger');
            if(er !== null){
                this.err.lista.removeChild(er);
            }
                //<li>
                let li = document.createElement('li');
                li.setAttribute('class', 'list-group-item list-group-item-danger');
                let txtErro = document.createTextNode(`O repositório ${input} não existe.`);
                li.appendChild(txtErro);
                this.lista.appendChild(li);
        }
    }
    apresentarBuscando(input){
        //<li>
        let li = document.createElement('li');
        li.setAttribute('class', 'list-group-item list-group-item-warning');
        let txtBuscando = document.createTextNode(`Aguarde... buscando o repositório ${input}.`);
        li.appendChild(txtBuscando);
        this.lista.appendChild(li);
    }
    renderizarTela() {
        //limpar o conteúdo de lista
        this.lista.innerHTML = '';
        //percorrer a lista de repositórios e criar os elementos
        this.repositorios.forEach(repositorio => {
            //<li>
            let li = document.createElement('li');
            
            li.setAttribute('class', 'list-group-item list-group-item-action');
            //<img>
            let img = document.createElement('img');
            img.setAttribute('src', repositorio.avatar_url);
            li.appendChild(img);
            //<strong>
            let strong = document.createElement('strong');
            let txtNome = document.createTextNode(repositorio.nome);
            strong.appendChild(txtNome);
            li.appendChild(strong);
            //<p>
            let p = document.createElement('p');
            let txtDescricao = document.createTextNode(repositorio.descricao);
            p.appendChild(txtDescricao);
            li.appendChild(p);
            //<a>
            let a = document.createElement('a');
            a.setAttribute('target', '_blank');
            a.setAttribute('href', repositorio.link);
            let txtA = document.createTextNode('Acessar');
            a.appendChild(txtA);
            li.appendChild(a);
            //add li como filho de ul
            let deletar = this.lista.appendChild(li);
            li.onclick = () =>{
                this.deletarRepositorio(deletar);
            }            
            //limpa o conteúdo do input
            this.formulario.querySelector('input[id=repositorio]').value = '';
            //add foco no input
            this.formulario.querySelector('input[id=repositorio]').focus();
        });
    }
    salvarDadosStorage(){
        localStorage.setItem('repositorios',JSON.stringify(this.repositorios));
    }
    deletarRepositorio(repo){
        //remove repositório do array
        let t = this.repositorios.splice(repo.textContent,1);
        this.salvarDadosStorage();
        // console.log(this.repositorios);
        this.renderizarTela();
    }
}

new App();