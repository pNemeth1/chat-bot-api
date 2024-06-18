/**
 * Service for handling Langchain Chat operations.
 *
 * This service is responsible for processing user chat messages by leveraging
 * OpenAI's language models. It transforms the user's input using a prompt template,
 * sends it to the ChatOpenAI model for processing, and then formats the response
 * appropriately before sending it back to the user.
 *
 * @class LangchainChatService
 * @decorator Injectable - Marks the class as a service that can be injected.
 *
 * @method chat - Processes a user's chat message. It uses a template to structure
 *                the prompt, sends it to the OpenAI model, and then formats the
 *                output into a human-readable response. In case of errors, it
 *                throws an HttpException with the appropriate status and message.
 */

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { BasicMessageDto } from "./dtos/basic-message.dto";
import { TEMPLATES } from "src/utils/constants/templates.constants";
import { openAI } from "src/utils/constants/openAI.constants";
import customMessage from "src/utils/responses/customMessage.response";
import { MESSAGES } from "src/utils/constants/messages.constants";

@Injectable()
export class LangchainService {
  async chat(basicMessageDto: BasicMessageDto) {
    try {
      const prompt = PromptTemplate.fromTemplate(TEMPLATES.BASIC_CHAT_TEMPLATE);

      // LLM temperature is a parameter that influences the language model's output, determining whether the output is more random and creative or more predictable. A higher temperature will result in lower probability, i.e more creative outputs.

      const model = new ChatOpenAI({
        temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
        modelName: openAI.GPT_3_5_TURBO_1106.toString(),
      });

      const outputParser = new HttpResponseOutputParser();

      // Chains are one of the core concepts of LangChain. Chains allow you to go beyond just a single API call to a language model and instead chain together multiple calls in a logical sequence. They allow you to combine multiple components to create a coherent application
      const chain = prompt.pipe(model).pipe(outputParser);

      const response = await chain.invoke({
        input: basicMessageDto.user_query,
      });

      return customMessage(
        HttpStatus.OK,
        MESSAGES.SUCCESS,
        Object.values(response)
          .map((code) => String.fromCharCode(code))
          .join("")
      );
    } catch (e: unknown) {
      throw new HttpException(
        customMessage(
          HttpStatus.INTERNAL_SERVER_ERROR,
          MESSAGES.EXTERNAL_SERVER_ERROR
        ),
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
