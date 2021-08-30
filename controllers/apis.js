function getApis(req, res) {
    const api = require('./../urls_api/url');
    const apis = [];
    var item = '';
    api.stack.forEach(element => {
        apis.push({ method: element.route.methods, ruta: element.route.path });
        let method = '';
        if (element.route.methods.get) {
            method = 'GET';
        } else if (element.route.methods.post) {
            method = 'POST';
        } else if (element.route.methods.put) {
            method = 'PUT';
        } else if (element.route.methods.delete) {
            method = 'DELETE';
        }
        item += `<p><label>Method: </label> ${method}, <label>ruta: </label> <a href="/apis/${element.route.path}">${element.route.path}</a></p>`;
    });
    const resp = `
    <style type="text/css">
    .example-loading-shade {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0px;
        right: 0;
        background: rgb(27, 27, 27);
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    p{
        height: 30px;
        border-radius: 5px;
        background: #ea4908;
        padding: 5px;
        box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2);
        margin-top: 10px;
        margin-inline: 30px;
        color: white;
        text-align: center;
        text-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2);
        transition: 100ms;
      }
      p:hover{
          margin-inline:10px;
          cursor: pointer;
          transition: 100ms;
      }
      .container{
          display:block;
      }
  </style>
  <div class="example-loading-shade">
  <div class="container">
  <h1 style="color: white;">Bienvenido al servidor de APis de la CTC</h1>
    <div id="lista" name="lista" style="overflow-y: scroll; height: 350px;scrollbar-width: none;">
        ${item}
    </div>
    </div>
    </div>
   `
    return res.status(200).send(resp);
}

module.exports = {
    getApis,
};