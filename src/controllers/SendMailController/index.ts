import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';

import SurveysRepository from "../../repositories/Surveys";
import SurveysUserRepository from "../../repositories/SurveysUser";
import UsersRepository from "../../repositories/User";
import SendMail from "../../services/SendMail";
import { AppError } from "../../errors/AppError";

class SendMailController {
  async execute(req: Request, res: Response){
    const { email, survey_id } = req.body;

    const userRepository = getCustomRepository(UsersRepository);
    const surveyRepository = getCustomRepository(SurveysRepository);
    const surveyUserRepository = getCustomRepository(SurveysUserRepository);

      const user = await userRepository.findOne({email});

        if(!user){
          throw new AppError("User does not exists")
        }

      const survey = await surveyRepository.findOne({id: survey_id});

        if(!survey) {
          throw new AppError("Survey does not exists")
        }

      const npsPath = resolve(__dirname, "..", "..", "views", "emails", "npsMail.hbs");


  //Save informations
        const surveyUserExists = await surveyUserRepository.findOne({
          where: { user_id: user.id, value: null},
          relations:["user", "survey"]
        });

        const variables = {
          nome: user.nome,
          title: survey.title,
          description: survey.description,
          id: "",
          link: process.env.URL_MAIL
        }

        if(surveyUserExists){
          variables.id = surveyUserExists.id;

          await SendMail.execute(email, survey.title, variables, npsPath);
          return res.json(surveyUserExists);
        }

    const surveyUser = surveyUserRepository.create({
      user_id: user.id,
      survey_id
    });

  //Send Email
    await surveyUserRepository.save(surveyUser);

    variables.id = surveyUser.id;

    await SendMail.execute(email, survey.title, variables, npsPath );

    return res.json(surveyUser);

  };
};

export default SendMailController;