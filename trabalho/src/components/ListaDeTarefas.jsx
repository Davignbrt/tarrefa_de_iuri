import './ListaDeTarefas.css' // Mudei o css
import { useState } from 'react'

export default function ListaDeTarefas(){

    const [tarefa, setTarefa] = useState('') // Definição de uma variável pra guardar uma tarefa
    const [lista, setLista] = useState([]) // Definição da Lista de tarefas
    const [situacoes, setSituacoes] = useState([])// Variável pra controlar os status das tarefas
    const [situacao, setSituacao] = useState('Não Feita') // Status individual de cada tarefa


    // Aqui foi definida uma função pra travar os processos e sempre que uma nova tarefa for criada "limpar" o form
    const handleSubmit = (e) => {
        e.preventDefault(); // Aqui eu travo o processo sempre que a função for chamada.
        setLista([...lista, tarefa]) // Atualizo a lista de tarefas
        setTarefa('') // Volto pro valor de vazio na variável
        setSituacao('Não Feita');  // Aqui eu defino que toda tarefa sempre vai começar como "Não Feita"
        setSituacoes([...situacoes, situacao]) // Adiciono o status da tarefa aqui
    }

    // Aqui eu defino a função que vai ficar responsável por ordenar as listas - Não peita > Feita
    function Ordenador() {
        // Lista com todos os Ids das tarefas "Feitas"
        const idtarefasNaoFeitas = 
            // Aqui eu faço um mapeamento da minha lista pra criar uma lista de objetos com o valor + índice.
            situacoes.map((situacao, index) => ({ situacao, index }))
            // Já aqui eu verifico os objetos que situacao === "Não Feita"
            .filter(item => item.situacao === "Não Feita")
            // Dos objetos filtrados eu mapeio e pego apenas os ids deles
            .map(item => item.index);

        // Mesmo processo de idtarefasNaoFeitas
        const idtarefasFeitas = 
            situacoes.map((situacao, index) => ({ situacao, index }))
            .filter(item => item.situacao === "Feita")
            .map(item => item.index);

        // Aqui eu crio uma nova lista de como vão ficar organizados os ids
        const novaOrdem = [
            ...idtarefasNaoFeitas, 
            ...idtarefasFeitas
        ]

        // OBS: Ambas as listas (lista e situacoes) tem o mesmo tamanho e cada id é correspondente entre elas
        // Crio uma lista auxiliar pra organizar as tarefas com baso nos ids da lista novaOrdem
        const novaLista = novaOrdem.map(i => lista[i])
        // Crio uma lista auxiliar pra organizar os status das tarefas com baso nos ids da lista novaOrdem
        const novasSituacoes = novaOrdem.map(i =>situacoes[i])

        // Atualizo os valores das listas
        setLista(novaLista)
        setSituacoes(novasSituacoes)
        }

    // Função responsável por remover apenas um item
    function Deletar(id) {
        //  Pego todos os item em uma lista auxiliar, execeto o que eu vou apagar, e em seguida atualizo a lista geral
        const lista_status_aux = situacoes.filter((item, id_item) => id_item !== id)
        const lista_tarefas_aux = lista.filter((item, id_item) => id_item !== id)

        // Atualizo os valores
        setLista(lista_tarefas_aux)
        setSituacoes(lista_status_aux)
    }
    function moverItem(array, de, para) {
        const copia = [...array];
        const [itemMovido] = copia.splice(de, 1);
        copia.splice(para, 0, itemMovido);
        return copia;
        }
    
    const moverParaCima = (index) => {
        if (index === 0) return;

        const novaLista = moverItem(lista, index, index - 1);
        const novasSituacoes = moverItem(situacoes, index, index - 1);

        setLista(novaLista);
        setSituacoes(novasSituacoes);
        };

    const moverParaBaixo = (index) => {
        if (index === lista.length - 1) return;

        const novaLista = moverItem(lista, index, index + 1);
        const novasSituacoes = moverItem(situacoes, index, index + 1);

        setLista(novaLista);
        setSituacoes(novasSituacoes);
        };

    // Retorno do meu componente 
    return(
        <div>
            <h2>Lista de Tarefas React</h2>

            {/* Aqui é onde chama a função no evento onSubmit*/}
            <form onSubmit={handleSubmit}>
                <label>
                    {/* O "e" significa evenet */}
                    <input type="text" name="tarefa" value={tarefa} onChange={(e) => setTarefa(e.target.value)} /> 
                </label>
                    <input type="submit" value="Adicionar" />
            </form>

            {/* Aqui eu listo os itens da lista */}
            <div className='botoes'>
                <button onClick={Ordenador}>Ordenar</button> {/* Chamo a função pra ordenar as tarefas */}
                <button onClick={() => setLista([])}>Limpar tarefas</button> {/* Aqui eu limpo todas as tarefas */}
            </div>
            <br />
            <ul>
                {/* Faço um mapeamento da lista de tarefas pegando o item e seu id */}
                {lista.map((item, index) =>
                <li key={index}>

                    {item} - {situacoes[index]} {/* Aqui eu mostro item(tarefa) e seu status (passando o seu respectivo id, só que na lista de situacões) */}

                    <button onClick={() => Deletar(index)}>🗑️</button>
                    <br />
                    <button className='prioridade' onClick={() => moverParaBaixo(index)}>↓</button>
                    <button className='prioridade' onClick={() => moverParaCima(index)}>↑</button>
                    
                    {/* Aqui é onde eu seleciono o status da tarefa  */}
                    <select
                        value={situacoes[index]} // Pego o valor da mesma passando sua posição na lista de situações 
                        name="opcao"
                        // Aqui é a função onde eu mudo o status dela
                        // Esse (e) => dentro da função é oque vai me permitir fazer ela
                        onChange={(e) => {
                            const novasSituacoes = [...situacoes]; // Crio uma lista auxiliar pra pegar todos os status
                            novasSituacoes[index] = e.target.value; // Aqui eu digo que na posição que aquela tarefa se encontra eu vou mudar o valor dela pra oque foi selecionado, por meio do event (e.target.value)
                            setSituacoes(novasSituacoes); // Atualizo a lista de situações
                    }}>
                        <option value="Não Feita">Não Feita</option>
                        <option value="Feita">Feita</option>
                    </select>
                </li>
            )}
            </ul>
            
        </div>
    )}