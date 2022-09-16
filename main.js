
// if(process.argv.length < 3){
    //     console.log("Zu wenige Kommandezeilen Argumente!")
    // }
    // text = process.argv[2]
    
    class Tokenizer{
        constructor(text){
            this.text = text;
            this.cursor = 0;
            this.digitTable = ["🥚","🐣","🐣🐣","🐣🐣🐣","🐣🐣🐣🐣","🐥","🐥🐥","🐥🐥🐥","🐥🐥🐥🐥","🐔"]
    }

    hasToken(){
        return (this.cursor < this.text.length);
    }

    getNumericTokenValue(token){
        let number = ""
        let digits = token.text.split("💧")
    
        for(let i = 0;i < digits.length; i++){
            let digit = this.digitTable.findIndex((e) => {
                return e == digits[i]
            })
    
            // führende Null entfernen
            if(!(i == 0 && digit == 0)){
                number += digit
            }
        }
        token.value = number
    
        return token
    }

    getNextToken(){
        if(!this.hasToken){
            return null;
        }

        const string = this.text.slice(this.cursor);

        // Whitespaces
        let matched = /^\s+/.exec(string)

        if(matched != null){
            this.cursor += matched[0].length;
            return this.getNextToken()
        }

        // Numbers
        matched = /^(🥚|(🐣){1,5}|(🐥){1,5}|🐔)(💧(🥚|(🐣){1,5}|(🐥){1,5}|🐔))*/.exec(string)
        
        if(matched !== null){
            this.cursor += matched[0].length;

            return {
                type: "Number",
                text: matched[0]
            }
        }

        // Default 
        matched = /^[^\s]*/.exec(string)

        if(matched !== null){
            this.cursor += matched[0].length;
            return {
                type: "Unknown",
                text: matched[0]
            }
        }
    }
}

// tokenizer = new Tokenizer(text);

// while(tokenizer.hasToken()){
//     token = tokenizer.getNextToken();
//     if(token.type == "Number"){
//         token = getNumericTokenValue(token)
//     }
//     else {
//         token.value = token.text
//     }

//     console.log(token);
// }

module.exports = Tokenizer