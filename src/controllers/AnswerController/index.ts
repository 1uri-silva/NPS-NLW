import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../../errors/AppError";
import SurveysUserRepository from "../../repositories/SurveysUser";


class AnswerController {

  // http://localhost:3333/answers/1?u=72360639-9597-4d6b-8fb6-604cbd0c2d2b

  async execute(req: Request, res: Response) {

    const { value } = req.params;
    const { u } = req.query;

    const surveyUserRepository = getCustomRepository(SurveysUserRepository);

    const surveyUser = await  surveyUserRepository.findOne({
      id: String(u)
    });

    if(!surveyUser) {

      throw new AppError("User does not exists")
      };
    

    surveyUser.value = Number(value);
    await surveyUserRepository.save(surveyUser);

    return res.json(surveyUser);
  }
}

export default AnswerController;



/**
 * Route Params => Paramentos que compõe a rota: /:1
 * 
 * Query Params => Busca, paginação: ?chave=valor
 */