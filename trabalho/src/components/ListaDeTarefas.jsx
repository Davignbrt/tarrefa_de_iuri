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

    // Aqui eu defino a função que vai ficar responsável por ordenar as listas - Não feita > Feita
    function Ordenador() {
        // Lista com todos os Ids das tarefas "Não Feitas"
        const idtarefasNaoFeitas = 
            situacoes.map((situacao, index) => ({ situacao, index }))
            .filter(item => item.situacao === "Não Feita")
            .map(item => item.index);

        const idtarefasFeitas = 
            situacoes.map((situacao, index) => ({ situacao, index }))
            .filter(item => item.situacao === "Feita")
            .map(item => item.index);

        const novaOrdem = [
            ...idtarefasNaoFeitas, 
            ...idtarefasFeitas
        ]

        const novaLista = novaOrdem.map(i => lista[i])
        const novasSituacoes = novaOrdem.map(i => situacoes[i])

        setLista(novaLista)
        setSituacoes(novasSituacoes)
    }

    // Função responsável por remover apenas um item
    function Deletar(id) {
        const lista_status_aux = situacoes.filter((item, id_item) => id_item !== id)
        const lista_tarefas_aux = lista.filter((item, id_item) => id_item !== id)

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

    function Limpar_Lista () {
        setLista([])
        setSituacoes([])
    }

    // Retorno do meu componente 
    return(
        <div>

            {/* Aqui é onde chama a função no evento onSubmit*/}
            <form onSubmit={handleSubmit} className='form-container'>
                <label>
                    {/* O "e" significa event */}
                    <input
                        type="text"
                        name="tarefa"
                        value={tarefa}
                        onChange={(e) => setTarefa(e.target.value)}
                    />
                </label>

                {/* Agrupe todos os botões abaixo do input */}
                <div className='botoes'>
                    <input type="submit" value="Adicionar" className="adicionar" /> {/* Botão agora é verde */}
                    <button className="btn-ordenar" onClick={Ordenador}>Ordenar</button> {/* Agora azul */}
                    <button className="btn-limpar" onClick={Limpar_Lista}>Limpar tarefas</button>
                </div>
            </form>

            <br />
            <ul>
                {/* Faço um mapeamento da lista de tarefas pegando o item e seu id */}
                {lista.map((item, index) =>
                <li key={index}>
                <div className="tarefa-texto">
                    {item} - {situacoes[index]} {/* Aqui eu mostro item(tarefa) e seu status (passando o seu respectivo id, só que na lista de situacões) */}
                </div>  
                    {/* Agrupo os botões e o select em uma linha */}
                    <div className="controles-tarefa">
                        <button className='lixeira' onClick={() => Deletar(index)}>🗑️</button>
                        
                        <button className='prioridade' onClick={() => moverParaBaixo(index)}>↓</button>
                        <button className='prioridade' onClick={() => moverParaCima(index)}>↑</button>

                        {/* Aqui é onde eu seleciono o status da tarefa  */}
                        <select
                            value={situacoes[index]} 
                            name="opcao"
                            onChange={(e) => {
                                const novasSituacoes = [...situacoes];
                                novasSituacoes[index] = e.target.value;
                                setSituacoes(novasSituacoes);
                            }}>
                            <option value="Não Feita">Não Feita</option>
                            <option value="Feita">Feita</option>
                        </select>
                    </div>
                </li>
            )}
            </ul>
            
        </div>
    )}
