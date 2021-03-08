import { EntityRepository, Repository } from "typeorm";
import SurveysUser from "../../models/SurveyUser";

@EntityRepository(SurveysUser)
class SurveysUserRepository extends Repository<SurveysUser>{}

export  default SurveysUserRepository;