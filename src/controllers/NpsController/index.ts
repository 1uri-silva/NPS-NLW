import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import SurveysUserRepository from "../../repositories/SurveysUser";


class NpsController {

  async execute(req: Request, res: Response){
    const { survey_id } = req.params;

    const surveysUserRepository = getCustomRepository(SurveysUserRepository);

    const surveyUsers = await surveysUserRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractor = surveyUsers.filter(survey => (
      survey.value >= 0 && survey.value <= 6
    )).length;

    const promoter =  surveyUsers.filter(survey => (
      survey.value >= 9 && survey.value <= 10
    )).length;

    const passive =  surveyUsers.filter(survey => (
      survey.value >= 7 && survey.value <= 8
    )).length;

    const totalAnswers = surveyUsers.length;

    const calculate = Number(
      ((( promoter - detractor ) / totalAnswers) * 100).toFixed(2)
    );

    return res.json({
      detractor,
      promoter,
      passive,
      totalAnswers,
      nps: calculate
    });
  }

}

export default NpsController;


/**
 * Detratores => 0 a 6
 * Passivos => 7 - 8
 * Promotores => 9 - 10
 * 
 * (Número de promotores - Número de detratores) / (Número de respondentes) X 100
 */