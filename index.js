//Commit 5

const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo ao App de Metas";

let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

async function salvarMetas() {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

async function cadastrarMeta () {
    const meta = await input ({message:"Digite a meta:"})
    
    if (meta.length == 0) {
        mensagem = 'A meta não pode ser vazia.'
        return
    }

    metas.push(
        { value: meta, checked: false}
    )

    mensagem = "Meta cadastrada com sucesso!"
}

async function listarMetas () {
    if (!metas || metas.length === 0) {
        mensagem = "sem metas"
        return;
    }
    const respostas = await checkbox ({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar esta etapa",
        instructions: false,
        choices: [...metas],

    })

    metas.forEach((m) => {
        m.checked = false
    })

    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }


    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

}

async function metasRealizadas() {
    if (metas.length == 0) {
        mensagem = "Não existem metas abertas: "
        return
    }
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
        if (realizadas.length == 0) {
            mensagem = "Não existem metas realizadas: "
            return
        }
        
    await select ({
        message: "Metas Realizadas " + realizadas.length,
        choices: [...realizadas]
    })
}

async function metasAbertas() {
    if (metas.length == 0) {
        mensagem = "Não existem metas abertas: "
        return
    }
    const abertas= metas.filter((meta) => {
        return !meta.checked
    })

    if (abertas.length == 0) {
        mensagem = "Não existem metas realizadas: "
        return
    }

   
    await select ({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
}

async function deletarMetas() {
    if (metas.length == 0){
        mensagem = "Não existem metas para deletar"
        return
    }
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    const itemsDeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itemsDeletar.length == 0) {
        mensagem = "Nenhum item selecionado para deletar!"
        return
    }

    itemsDeletar.forEach((item) => {
        metas = metas.filter ((meta) => {
            return meta.value !=item
        })
    })

    console.log("Meta(s) deletada(s) com sucesso!")
}

function mostrarMensagem() {
    console.clear();
    if (mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}
async function start () {
    await carregarMetas()

    while(true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select ({
            message: "Escolha uma opção:",
            choices: [
                {name: "Cadastrar nova meta", value: "cadastrar" },
                {name: "Listar metas", value: "listar" },
                {name: "Metas realizadas", value: "realizadas" },
                {name: "Metas abertas", value: "abertas" },
                {name: "Deletar Metas", value: "deletar" },
                {name: "Sair", value: "sair"},
            ],    
        })

        switch(opcao) {
            case "cadastrar":
                await cadastrarMeta()
                console.log(metas)
                break
            case "listar":
                await listarMetas()
                console.log(metas)
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break   
            case "deletar":
                await deletarMetas()
                break     
            case "sair":
                return
            }
   
    }
}
start()