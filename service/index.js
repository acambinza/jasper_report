import express from 'express'
import fetch from 'node-fetch'
import fs from 'fs'

const server = express()

async function downloadFile(url, options, filename) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Falha ao baixar o arquivo: ${response.status} ${response.statusText}`);
        }

        const fileStream = fs.createWriteStream(filename);
        response.body.pipe(fileStream);

        return new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });
    } catch (error) {
        console.error('Erro ao baixar o arquivo PDF:', error);
        throw error;
    }
}

server.get('/download', async (req, res) => {

    const url = 'http://localhost:8080/jasperserver/rest_v2/reports/Colab/listEmployeesSql.pdf';
    const fileName = url.split("/").pop();
    const options = {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + Buffer.from("colab" + ':' + "654321").toString('base64')
        }
    }

    downloadFile(url, options, fileName)
        .then(() => {
            return res
                .download(fileName)
        })
        .catch(error => {
            return res
                .status(res.statusCode)
                .send({
                    data: [],
                    status: res.statusCode,
                    message: error.message
                })
        });

})


server.listen(3001, () => console.log("Server up running %s", 3001))
