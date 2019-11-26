var soap = require('soap');
var express = require('express')
var app = express()

var url = "https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl";

getSoapDataAsync = async (url, args) => {
    const client = await soap.createClientAsync(url)
    return client.consultaCEPAsync(args, (err, result) => {
        return result
    })
}

app.get('/:cep', async (req, res) => {
    let retorno = {}
    try {
        const args = {cep: parseInt(req.params.cep)}
        const resultado = await getSoapDataAsync(url, args)
        retorno.result = resultado[0].return
    } catch (error) {
        retorno.error = JSON.parse(JSON.stringify(error.cause.root.Envelope.Body.Fault.faultstring))
    }

    res.send(retorno)
})


app.listen(3000)