const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

require('dotenv').config()
 
const bot = new Telegraf(process.env.BOT_TOKEN);
const fs = require('fs');

let active = false;

bot.start((ctx)=>{
    bot.telegram.sendMessage(
        chat_id = ctx.chat.id,
        text = "<b>Welcome</b> 😎\nInorder to make me accept ur messages continously, click on the <b>activate button👇</b>",
        {
            parse_mode : "HTML",
            reply_markup :{
                    keyboard: [[
                        {text : "🖊 activate"}
                    ]],
                resize_keyboard:true,
                one_time_keyboard:true
                }
        }
    )
});



bot.on(message('text'), (ctx) => {
    const data = ctx.message.text;
    if (!active){
        if (data != "🖊 activate"){
            bot.telegram.sendMessage(
                ctx.chat.id,
                "❌❌ activate the bot first !!!"
            )
        }
        else {
            active = true;
            if (fs.existsSync("file.txt")){
                fs.unlink('file.txt',function(err){console.log("unable to delete the file")})
            }

            bot.telegram.sendMessage(
                ctx.chat.id,
                "I am active😊, send me your messages or forward it to me"
            )
        }
    }
    else {
        if (data == "📁stop"){
            ctx.replyWithDocument({source : "file.txt"},{
                caption: "😎 we had greate time, hope see you soon\n\nyou can <b><i>activate</i></b> me again😍",
                reply_markup: {
                    keyboard: [[
                            {text : "🖊 activate"},
                        ]],
                    resize_keyboard:true,
                    one_time_keyboard:true
                },
                parse_mode : "HTML",

            });
            active = false;
        }
        else {
            fs.appendFile('file.txt',data+'\n',function(err){
                if (err) {
                    console.log("unable to save")
                    throw err
                };
            })
            bot.telegram.sendMessage(
                ctx.chat.id, 
                "📝🖋 I am writing it down\n" + 
                "you can send me more , or you can <b>stop</b> me😔"
                ,
                {
                reply_markup: {
                    keyboard: [[
                            {text : "📁stop" },
                        ]],
                    resize_keyboard:true
                },
                parse_mode : "HTML"
            });
    }
}
})




bot.launch();