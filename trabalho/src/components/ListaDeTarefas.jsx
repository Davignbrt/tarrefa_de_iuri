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
        setSituacoes([...situacoes, situacao]) // Adiciono o status da tarefa aqui
        setSituacao('Não Feita');  // Aqui eu defino que toda tarefa sempre vai começar como "Não Feita"
    }

    // Aqui eu defino a função que vai ficar responsável por ordenar as listas - Não feita > Feita
    function Ordenador() {
        // Lista com todos os Ids das tarefas "Não Feitas"
        const idtarefasNaoFeitas = 
            //Mapeio toda a lista e crio uma lista de dicionários 
            situacoes.map((situacao, index) => ({ situacao, index }))
            // Da Lista de dicionário eu filtro e vejo quais tem o situação como "Não Feita"
            .filter(item => item.situacao === "Não Feita")
            // Com as listas já filtradas, eu pego os ids das tarefas não feitas 
            .map(item => item.index);

        // Lista com todos os Ids das tarefas "Feitas"
        const idtarefasFeitas = 
            situacoes.map((situacao, index) => ({ situacao, index }))
            .filter(item => item.situacao === "Feita")
            .map(item => item.index);

        // Crio uma lista com os respectivos ids, agora oredenados
        const novaOrdem = [
            ...idtarefasNaoFeitas, 
            ...idtarefasFeitas
        ]

        // Listas auxiliares pra pegar os valores já ordenados
        const novaLista = novaOrdem.map(i => lista[i])
        const novasSituacoes = novaOrdem.map(i => situacoes[i])

        // Agora atualizo as listas 
        setLista(novaLista)
        setSituacoes(novasSituacoes)
    }

    // Função responsável por remover apenas um item
    function Deletar(id) {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta tarefa?");
        if (!confirmar) return; // se cancelar, não faz nada
        // Aqui eu pego a lista e pego todos os item, menos o que eu não quero. Usando filter
        const lista_status_aux = situacoes.filter((item, id_item) => id_item !== id)
        const lista_tarefas_aux = lista.filter((item, id_item) => id_item !== id)

        // Atualizo as listas 
        setLista(lista_tarefas_aux)
        setSituacoes(lista_status_aux)
    }
    
    // Função responsável por mover um item dentro de um array de uma posição para outra
    function moverItem(array, de, para) {
        const copia = [...array]; // Cria uma cópia do array original (pra não alterar direto o estado)

        const [itemMovido] = copia.splice(de, 1); // Remove 1 item na posição "de" e guarda ele
        copia.splice(para, 0, itemMovido);        // Insere o item removido na posição "para"

        return copia; // Retorna o novo array com o item reposicionado
    }
    
    // Função que move uma tarefa para cima na lista
    const moverParaCima = (index) => {
        if (index === 0) return; // Se já está no topo, não faz nada

        // Move o item da lista para cima (posição anterior)
        const novaLista = moverItem(lista, index, index - 1);

        // Move também a situação correspondente (status) na mesma ordem
        const novasSituacoes = moverItem(situacoes, index, index - 1);

        // Atualiza o estado com as novas ordens
        setLista(novaLista);
        setSituacoes(novasSituacoes);
    }

    // Função que move uma tarefa para baixo na lista
    const moverParaBaixo = (index) => {
        if (index === lista.length - 1) return; // Se já está no final, não faz nada

        // Move o item da lista para baixo (posição seguinte)
        const novaLista = moverItem(lista, index, index + 1);

        // Move também a situação correspondente na mesma ordem
        const novasSituacoes = moverItem(situacoes, index, index + 1);

        // Atualiza o estado com as novas ordens
        setLista(novaLista);
        setSituacoes(novasSituacoes);
    }

    // Função responsável por limpar as listas
    function Limpar_Lista () {
        const confirmar = window.confirm("Tem certeza que deseja excluir todas as tarefas?");
        if (!confirmar) return; // se cancelar, não faz nada
        // Define as duas listas como vazias 
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
                    <button type='button' className="btn-ordenar" onClick={() => Ordenador()}>Ordenar</button> {/* Agora azul */}
                    <button type='button' className="btn-limpar" onClick={() => Limpar_Lista()}>Limpar tarefas</button>
                </div>
            </form>

            <br />
            <ul>
                {/* Faço um mapeamento da lista de tarefas pegando o item e seu id */}
                {lista.map((item, index) =>
                <li key={index}>
                <div className="tarefa-texto">
                    <p className="descricao-tarefa">
                        {item} - {situacoes[index]}
                        {/* Aqui eu mostro item(tarefa) e seu status (passando o seu respectivo id, só que na lista de situacões) */}
                    </p>
                </div>  
                    {/* Agrupo os botões e o select em uma linha */}
                    <div className="controles-tarefa">
                        <button className='lixeira' onClick={() => Deletar(index)}>🗑️</button>
                        
                        <button className='prioridade' onClick={() => moverParaBaixo(index)}>↓</button>
                        <button className='prioridade' onClick={() => moverParaCima(index)}>↑</button>

                        {/* Aqui é onde eu seleciono o status da tarefa  */}
                        <select
                            // Aqui eu digo que o valor do campo de seleção é igual do valor da situação da tarefa
                            value={situacoes[index]} 
                            name="opcao"
                            // Aqui é onde eu crio o evento 
                            onChange={(e) => {
                                // Crio uma lista auxiliar
                                const novasSituacoes = [...situacoes];
                                // Digo que na posição(index) vou alterar o valor pra o novo valor selecionado (e.target.value) 
                                novasSituacoes[index] = e.target.value;
                                // Atualizo a lista principal
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
