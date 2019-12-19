import os
from flask import Flask, jsonify, json, render_template

app = Flask(__name__,static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html')

# Carrega municípo por sigla do estado
# Arquivos baixados no github: https://github.com/tbrugz/geodata-br/tree/master/geojson
@app.route('/api/municipios/<sigla>', methods=['GET'])
def get_municipio(sigla):
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    
    filename = ''
    if sigla.upper() == 'MA':
        filename = 'geojs-21-mun.json'
    elif sigla.upper() == 'PI':
        filename ='geojs-22-mun.json'

    if filename != '':
        json_url = os.path.join(SITE_ROOT, "geojson", filename)
        data = json.load(open(json_url))
        return data
    
    return {} 

@app.route('/api/pontos/', methods=['GET'])
def get_pontos():
    return jsonify({
        'pontos': [
            [-44.3001,-2.52001, 3, "Bar do Joá"],
            [-44.309468, -2.509284, 4, "Estrela Bar"],
            [-44.307802, -2.557744, 5, "Mercadao Bar"],
            [-44.251520, -2.526351, 6, "Bar Cidade Olímpica"],
            [-44.251523, -2.526358, 6, "Turu Bar"],
            [-44.251533, -2.526378, 6, "Bar Rexon"],
            [-44.308478, -2.527898, 6, "Bar Deuzete"],
            [-46.328358, -7.217394, 7, "Bar do Mateus"],
            [-45.925941,-1.281689, 8, "Bar da Minerva"],
            [-45.925941, -10.232576, 9, "Bar da Tia"]
        ]
    })

if __name__ == '__main__':
    app.run(debug=True)    