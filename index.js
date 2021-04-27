
const bodyParser = require("body-parser")

var bodyparser = require('body-parser');
var mongoose =  require('mongoose');
var port = process.env.PORT || 3800;
var express = require('express');
var User = require('./models/user');
var UserCustomer = require('./models/userCustomer');
var Menu = require('./models/menuData');
var UserService =  require('./models/userService');
var Notification = require('./models/notifications');
var moment = require('moment');


var user_routes = require('./routes/user');
var message_routes = require('./routes/message');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var geo_routes = require('./routes/geojson');
var menu_routes = require('./routes/menu');
var notification_routes = require('./routes/notifications');
var settings_routes = require('./routes/settings');
var horario_routes = require('./routes/horario');
var empresa_routes = require('./routes/empresa');
var customer_routes = require('./routes/userCustomer');

var app = express();
var configMensaje = require('./services/configMensaje');
var Telegraf = require('telegraf');


const bot = new Telegraf('1287976320:AAGQkUCSPvdWfL6FY3a0XZ-ayXP_2I67UI4');

var band = false;
var email = false;
var name = false;
var licencia = false;
var user;
var idAsignement;
var rastreo = false;
var executeData = 0;
var packageData = false;
var packSelect;
var menuData = [];
var dataNumber = [];
var idUserDelibery;

var server = require('http').Server(app);
var io = require('socket.io')(server);




io.on('connection', function (socket) {
    console.log('User connected');
    socket.emit('new-data', 'user connected');

});


/*server.listen(3000, () => {
    console.log('service socket is active in port 3000');
});*/

/*io.on('connection', function(socket){
    socket.on('save-message',function (new_msm) {
        io.emit('new-message',{message: new_msm});
    })

    socket.on('save-user', function(user){
        io.emit('new-user', {user:user});
    });

    socket.on('save-users',function(users){
        io.emit('new-users',{users})
    })

}); */


bot.start((ctx) => {
    ctx.reply('Bienvenido a VxOS Bot, soy el asistente para ayudarte a registrar a tus clientes y poder aplicar las licencias, si deseas registrar inmediatamente, escribe "registrar", si quieres ver el menu, presiona /menu o escribelo, es un gusto ayudarte');
});

bot.help((ctx) => {
    ctx.reply('Si deseas asistencia personalizada, contactanos en: support@vxos-software.com.mx, presiona /menu para regresar al menú');
});

bot.settings((ctx) => {
    ctx.reply('Settings');
});

bot.command(['menu'], (ctx)=> {
    getProductServices();
    ctx.reply('Este es el menu de VxOS Bot, con esto puedo ayudarte:');
    ctx.reply('/registrar : Para registrar un nuevo usuario para aplicarle una licencia');
    ctx.reply('/menu : Para visualizar este menu');
    ctx.reply('/help : para solicitar el correo de soporte de VxOS');
    ctx.reply('/rastreo : para verificar el estatus de mi licencia o alguna licencia a través del código de rastreo');

})

bot.command(['rastreo'], (ctx)=> {
    ctx.reply('Rastrearemos el estatus de tu licencia, por favor, ingrese su ID de rastreo de 5 dígitos: ');
    rastreo = true;
})

bot.hears(['registrar', '/registrar'], ctx => {
    //console.log(ctx.message.text)
    clearData()
    band = true;
    var valueID;
    User.find((err, user) => {
        if(err) return res.status(500).send({message: 'Error en la peticion'});

        if(user){
            idAsignement = user[0]._id;
            //console.log(user[0]._id)
            //console.log(parseInt(user[0]._id.substr(1, 4)) + 1);
            valueID = parseInt(user[0]._id.substr(1, 4)) + 1;
            idAsignement =  'a' + valueID;
            //console.log(idAsignement)
            //return res.status(200).send({search: user})


        } else {
            console.log('NOK')
            //return res.status(404).send({message: 'El usuario no se ha podido identifcar en el servidor'})
        }
    }).sort({$natural:-1}).limit(1);
    ctx.reply('Hola ' + ctx.message.from.first_name + ' ,comprendido, dime el email del usuario, y el nombre del usuario, todo separado por comas, ejemplo: example@example.com, Rodriguez Alvarez');
})

bot.hears(['si', 'SI', 'sI', 'Si'], ctx => {
    if(name == true){
        packageData = true;
        ctx.reply('Este es el menu de productos/servicios que te ofrece ');
        console.log(menuData);
        for(let i = 0; i< menuData.length; i++){
            ctx.reply(i+1 + '.-' +menuData[i].nombre);
        }
        /*ctx.reply('2.- Adobe Licencia Única');
        ctx.reply('3.- Adobe Stock');*/


       /* var userRegister = new User();

        userRegister.nombre = user[1];
        userRegister.email = user[0];
        userRegister.estadoLicencia = '';
        userRegister.act1 = null;
        userRegister.act2 = null;
        userRegister.act3 = null;
        userRegister.act4 = null;
        userRegister.vigencia = null;
        userRegister.fechaActivacion = null;
        userRegister.referencia = idAsignement;
        userRegister._id = idAsignement;
        userRegister.tipoLicencia = user[2];


        User.find({
            $or: [
                {email: user[0]}
            ]
        }).exec((err, users) => {
            if(err) {
                ctx.reply('Hubo un error en la validación de usuarios');
            }

            if(users && users.length >= 1){
                ctx.reply('El usuario que intenta registrar ya existe');
            } else {

                userRegister.save((err, userStored) => {

                    if(userStored){
                        var data = 'Se ha registrado una nueva solicitud: usuario: ' + user[1] +', con email: ' + user[0] + ', y tipo de licencia: ' + user[2];
                        io.emit('new-data',data);
                        ctx.reply('El usuario: ' + user[1] +', con email: ' + user[0] + ', y tipo de licencia: ' + user[2] + '  ha sido capturado de forma correcta, en 24 horas, la aplicacion de la licencia estará activa' );
                        ctx.reply('Puede hacer el seguimiento del estatus de la licencia del usuario y servicio de soporte en: https://vxos-software.com.mx/ con el número de rastreo:' + idAsignement )
                        ctx.reply('Si desea registrar otro usuario, escriba "registrar", o bien, regresar al menu al escribir /menu , sino desea nada más, esto seria todo, que pase buen día ' );
                    } else {
                        ctx.reply('No se ha podido registrar el usuario')
                    }
                });

            }
        })



        licencia = true;*/
    } else {
      //  ctx.reply('Lo siento, no puedo comprender lo que escribiste, intentalo de nuevo')
    }

    if(packSelect === true ) {
        var userRegister = new User();

        userRegister.nombre = user[1];
        userRegister.email = user[0].toLowerCase();
        userRegister.estadoPedido = '';
        userRegister.act1 = null;
        userRegister.act2 = null;
        userRegister.act3 = null;
        userRegister.act4 = null;
        userRegister.vigencia = null;
        userRegister.fechaOrden = moment().unix();;
        userRegister.referencia = idAsignement;
        userRegister._id = idAsignement;
        userRegister.pedido = user[2];
        userRegister.user = idUserDelibery;



        User.find({
            $or: [
                {_id: idAsignement}
            ]
        }).exec((err, users) => {
            if(err) {
                ctx.reply('Hubo un error en la validación de usuarios');
            }

            if(users && users.length >= 1){
                ctx.reply('El usuario que intenta registrar ya existe');
            } else {

                userRegister.save((err, userStored) => {

                    if(userStored){
                        console.log(userStored);
                        var userDataDelivery = [];
                        var data = 'Se ha registrado una nueva solicitud: usuario: ' + user[1] +', con email: ' + user[0] + ', y tipo de licencia: ' + user[2];
                        userDataDelivery[0] = data;
                        userDataDelivery[1] = user[3];
                        io.emit('new-data',userDataDelivery);
                        //saveUser();

                        var notification = new Notification();

                            notification.nombre = 'Nuevo pedido';
                            notification.detalles = data;
                            notification.empresa = 'VxOS';
                            notification.fecha = moment().unix();
                            notification.estatus = 'false';
                            notification.user =  idUserDelibery;

                            Notification.find({
                                $or: [
                                    {_id: notification._id}
                                ]
                            }).exec((err, notifications) => {
                                console.log(err);
                                //if(err) return res.status(500).send({message: 'Error en la peticion de notificaciones'});

                                if(notifications && notifications.length >= 1){
                                    //return res.status(200).send({message: 'La notificacion que intenta registrar ya existe'})
                                } else {

                                    notification.save((err, userStored) => {
                                        //if(err) return res.status(500).send({message: 'Error al guardar la notificacion'})
                                        console.log(err);

                                        if(userStored){
                                           // res.status(200).send({user: userStored });
                                        } else {
                                            //res.status(404).send({message: 'No se ha registrado la notificacion'})
                                        }
                                    });

                                }
                            })





                        ctx.reply('El usuario: ' + user[1] +', con email: ' + user[0] + ', y tipo de licencia: ' + user[2] + '  ha sido capturado de forma correcta, en 24 horas, la aplicacion de la licencia estará activa' );
                        ctx.reply('Puede hacer el seguimiento del estatus de la licencia del usuario y servicio de soporte en: https://vxos-software.com.mx/ con el número de rastreo:' + idAsignement )
                        ctx.reply('Si desea registrar otro usuario, escriba "registrar", o bien, regresar al menu al escribir /menu , sino desea nada más, esto seria todo, que pase buen día ' );
                        clearData()
                    } else {
                        ctx.reply('No se ha podido registrar el usuario');
                        clearData()
                    }
                });

            }
        })



        licencia = true;
    }
});





bot.hears(['no', 'NO', 'nO', 'No'], ctx => {
    band = false;
    email = false;
    name = false;
    licencia = false;
    user  = '';
    ctx.reply('Comprendido, presiona /registrar para intentarlo de nuevo')
})



function getProductServices(){
    Menu.find((err,menus)=> {
        if(err){
            // res.status(500).send({message: 'Error en el servidor'});
        } else {
            if(menus){
                console.log(menus);
                menuData = menus;

                for (let i = 0;i< menuData.length; i++){
                    dataNumber.push(i.toString());
                }
                console.log(dataNumber);
                // res.status(200).send({menus: menus});
            } else {
                //  res.status(500).send({message: 'No existe ningun menu'});
            }
        }
    });

}


/*for (let i = 0; i < menuData.length; i++){

    bot.hears((i+1).toString, ctx => {

        console.log('ENTRO A VALOR');
        user[2] = menuData[parseInt(ctx.message.text)].nombre;
        /*if(ctx.message.text === '2'){
            user[2] = 'Producto unico';
        }

        if(ctx.message.text === '3'){
            user[2] = 'Adobe Stock';
        }
    */
       /* ctx.reply('El usuario: ' + user[1] +', con email: ' + user[0].toLowerCase() + ', y tipo de licencia: ' + user[2] + '  ha sido capturado de forma correcta, ¿es correcta la información?, escriba SI o NO' );
        name = false;
        packSelect = true;
        email = false;

    });*/


/*}*/

bot.on('text', ctx => {

    for(let i = 0; i < menuData.length; i++){
        if (ctx.message.text === dataNumber[i]){
            //ctx.reply(menuData[i].nombre);
            console.log(menuData[i].nombre);
            user[2] = menuData[i]._id;
            idUserDelibery = menuData[i].user;
            user[3] = '/' +  menuData[i].user;
            console.log('ACCESS GRANTED');
            ctx.reply('El usuario: ' + user[1] +', con email: ' + user[0].toLowerCase() + ', y tipo de licencia: ' + user[2] + '  ha sido capturado de forma correcta, ¿es correcta la información?, escriba SI o NO' );
            name = false;
            packSelect = true;
            email = false;
            band = false;
        }
    }

    if(band == true){
        email = true;
    } else {
        if(rastreo == true){

        } else {
            //clearData()
            // ctx.reply('Lo siento, no puedo comprender lo que escribiste, intentalo de nuevo')
        }
    }

    if(email === true){
        user = ctx.message.text;
        user = user.split(',');
        console.log(user);
        console.log('AAA');
        ctx.reply('El usuario: ' + user[1]+', con email: ' + user[0].toLowerCase() )
        ctx.reply('¿Es correcto? (escriba SI o NO)')
        name = true;

    } else {
        if(rastreo == true){

        } else {
            //clearData()
            // ctx.reply('Lo siento, no puedo comprender lo que escribiste, intentalo de nuevo')
        }
    }

    if(rastreo == true){
        ctx.reply('Lo estamos localizando')
        console.log(ctx.message.text)
        User.findOne({_id:  ctx.message.text.toLowerCase() }, (err, user) => {
            if(err) return ctx.reply('Error en la solicitud, intentelo más tarde');

            var estatus = 'Activo, listo para usar';
            if(user){
                console.log(user);
                console.log(user.estadoPedido);
                if(user.estadoPedido === ''){
                    estatus = 'Inactivo, aun en proceso de activaciòn';
                }
                ctx.reply('El estado de su pedido o solicitud de servicio, es es: ' + estatus + ' , el tipo de licencia adquirido es: ' + user.pedido)
                ctx.reply('Presione: /menu para volver al menu del Bot')
                clearData()


            } else {
                return ctx.reply('El usuario no existe en nuestros registros, presione /menu para regresar al menú');
                clearData()
            }
        })


    } else {
        //ctx.reply('Lo siento, no puedo comprender lo que escribiste, intentalo de nuevo')
    }



})

bot.launch();


function clearData(){
    band = false;
    email = false;
    name = false;
    licencia = false;
    user;
    idAsignement;
    rastreo = false;
    executeData = 0;
    packageData = false;
    packSelect = false;

}

mongoose.connect('mongodb+srv://vxos:qJnDOLabdSjPPTWj@vxos-server-db.x1su3.mongodb.net/vxost?retryWrites=true&w=majority', (err)=> {  //Cambiar a la BD de Tlint
    if(err){
        throw err;
    } else {
        console.log('Conectado a la DB');
        server.listen(port, function(){
            console.log('Estado conectado al puerto ' + port);
        })
    }
});
var cors = require('cors')

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use(cors())

app.post('/formulario', (req, res) => {
    configMensaje(req.body);
    res.status(200).send();
})


//routes
app.use('/api', user_routes);
/*app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', geo_routes);
app.use('/api', user_routes);*/
app.use('/api', menu_routes);
app.use('/api', notification_routes);
app.use('/api', settings_routes);
app.use('/api', horario_routes);
app.use('/api', empresa_routes);
app.use('/api', customer_routes);


//export
module.exports = app;
