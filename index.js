//Commit 5

const { select, input, checkbox } = require('@inquirer/prompts')



let metas = [ ]

async function cadastrarMeta () {
    const meta = await input ({message:"Digite a meta:"})
    
    if (meta.length == 0) {
        console.log('A meta não pode ser vazia.')
        return
    }

    metas.push(
        { value: meta, checked: false}
    )
}

async function listarMetas () {
    if (!metas || metas.length === 0) {
        console.log("sem metas");
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
        console.log("Nenhuma meta selecionada!")
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
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })
    if (realizadas.length == 0) {
        console.log("Não existem metas realizadas: ")
        return
    }
}

async function metasAbertas() {
    const realizadas = metas.filter((meta) => {
        return !meta.checked
    })
   
    if (abertas.length == 0) {
        console.log("Não existem metas abertas: ")
        return
    }
}

async function deletarMetas() {
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })

    const itemsDeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if (itemsDeletar.length == 0) {
        console.log("Nenhum item para deletar!")
        return
    }

    itemsDeletar.forEach((item) => {
        metas = metas.filter ((meta) => {
            return meta.value !=item
        })
    })

    console.log("Meta(s) deletada(s) com sucesso!")
}

async function start () {
    while(true){

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
            case "Realizadas":
                await metasRealizadas()
                break
            case "Abertas":
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