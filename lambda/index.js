/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const moment = require("moment-timezone");
var persistenceAdapter = getPersistenceAdapter();
const Alexa = require('ask-sdk-core');

function getPersistenceAdapter(tableName){
    function isAlexaHosted(){
        return process.env.S3_PERSISTENCE_BUCKET;
    }
    if (isAlexaHosted()){
        const {S3PersistenceAdapter} = require("ask-sdk-s3-persistence-adapter");
        return new S3PersistenceAdapter({
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    }
    else{
        const {DynamoDbPersistenceAdapter} = require("ask-sdk-dynamodb-persistence-adapter");
        return new DynamoDbPersistenceAdapter({
            tableName: tableName,
            createTable: true
        });
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const cont_name = sessionAttributes["cont_name"];
        const cont_valor = sessionAttributes["cont_valor"];
        const cont_venc = sessionAttributes["cont_venc"];
        const cont_period = sessionAttributes["cont_period"];
        const sessionCounter = sessionAttributes ["sessionCounter"];
        
        const speakOutput = 'Bem vindo a Skill Minhas Finanças';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const CadContaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CadContaIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        if(intent.confirmationSatus === "CONFIRMED"){
            const cont_name = Alexa.getSlotValue(requestEnvelope, "cont_name");
            const cont_valor = Alexa.getSlotValue(requestEnvelope, "cont_valor");
            const cont_venc = Alexa.getSlotValue(requestEnvelope, "cont_venc");
            const cont_period = Alexa.getSlotValue(requestEnvelope, "cont_period");
            
            sessionAttributes["cont_name"] = cont_name;
            sessionAttributes["cont_valor"] = cont_valor;
            sessionAttributes["cont_venc"] = cont_venc;
            sessionAttributes["cont_period"] = cont_period;
            return VerContaIntentHandler.handle(handlerInput);
        }

        return handlerInput.responseBuilder
            //.speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

/*const SaveContIntentHandler= {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SaveContIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;
        
        if(intent.confirmationSatus === "CONFIRMED"){
            const cont_name = Alexa.getSlotValue(requestEnvelope, "cont_name");
            const cont_valor = Alexa.getSlotValue(requestEnvelope, "cont_valor");
            const cont_venc = Alexa.getSlotValue(requestEnvelope, "cont_venc");
            const cont_period = Alexa.getSlotValue(requestEnvelope, "cont_period");
            
            sessionAttributes["cont_name"] = cont_name;
            sessionAttributes["cont_valor"] = cont_valor;
            sessionAttributes["cont_venc"] = cont_venc;
            sessionAttributes["cont_period"] = cont_period;
            return VerContaIntentHandler.handle(handlerInput);
        }

        return handlerInput.responseBuilder
            //.speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};*/

const VerContaIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'VerContaIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const cont_name = sessionAttributes["cont_name"];
        const cont_valor = sessionAttributes["cont_valor"];
        const cont_venc = sessionAttributes["cont_venc"];
        const cont_period = sessionAttributes["cont_period"];
        //const sessionCounter = sessionAttributes ["sessionCounter"];
        
        
        return handlerInput.responseBuilder
            .speak(cont_name)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Adeus';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Desculpe não consigo atender a esta solicitação';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoadAttributesRequestInterceptor = {
    async process(handlerInput){
        const {attributesManager, requestEnvelope} = handlerInput;
        if (Alexa.isNewSession(requestEnvelope)){
            const persistentAttributes = await attributesManager.getPersistenceAttributes() || {};
            console.log(" Carregando do armazenamento persistente" + JSON.stringify(persistentAttributes));
            attributesManager.setSessionAttributes(persistentAttributes);
        }
    }
};

const SaveAttributesResponseInterceptor = {
    async process(handlerInput,response){
        if(!response) return;
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession);
        if (shouldEndSession || Alexa.getRequestType(requestEnvelope)=== "SessionEndedRequest") {
            sessionAttributes["sessionCounter"] = sessionAttributes["sessionCounter"] ? sessionAttributes ["sessionCounter"] + 1: 1;
            console.log("Salvando para o armazenamento persistente" + JSON.stringify(sessionAttributes));
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CadContaIntentHandler,
        VerContaIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    //.addRequestInterceptors(
    //    LoadAttributesRequestInterceptor)
    .addResponseInterceptors(
        SaveAttributesResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .withPersistenceAdapter(persistenceAdapter)
    .lambda();