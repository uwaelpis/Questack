import moment from 'moment';
import data from '../../data';

/**
 * @exports
 * @class AnswerController
 */
class AnswerController {

  /**
       * Returns an Answer
       * @method postAnswers
       * @memberof AnswerController
       * @param {object} req
       * @param {object} res
       * @returns {(function|object)} Function next() or JSON object
       */
  static postAnswers(req, res) {

    const questionId = AnswerController.questionId(req);

    const allQuestions = data.questions;
    const findQuestion = allQuestions.findIndex(quest => quest.id === parseInt(questionId, 10))
    if (findQuestion === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const { userId, answerBody } = req.body;
    const allAnswers = data.answers;
    const id = allAnswers[allAnswers.length - 1].id + 1;
    const createdAt = moment();
    const updatedAt = moment();

    const newAnswer = {
      id, userId, questionId, answerBody, createdAt, updatedAt
    }
    if (answerBody !== '' && answerBody !== undefined) {
      allAnswers.push(newAnswer);

      return res.status(201).json({ message: 'Answer added successfully', content: newAnswer });
    }
    return res.status(400).json({ message: 'An answer field is required, Please fill up field', error: 'Bad Request' })

  }

  /**
           * Returns a Answers
           * @method getAnswers
           * @memberof AnswerController
           * @param {object} req
           * @param {object} res
           * @returns {(function|object)} Function next() or JSON object
           */

  static getAnswers(req, res) {
    const questionId = AnswerController.questionId(req);
    const allAnswers = data.answers;

    const findAnswer = allAnswers.filter(ans => ans.questionId == parseInt(questionId, 10));

    if (findAnswer.length !== 0) {
      return res.status(200).json({ answer: findAnswer })
    }
    return res.status(200).json({ answer: 'There is no answer given yet' })

  }

  /**
       * Returns a message
       * @method AddPreferredAnswer
       * @memberof AnswerController
       * @param {object} req
       * @param {object} res
       * @returns {(function|object)} Function next() or JSON object
       */

  static AddPreferredAnswer(req, res) {
    const qid = AnswerController.questionId(req);
    const aid = AnswerController.answerId(req);
    const preferredAnswer = data.preferredAnswers;
    const id = qid;

    const findOption = preferredAnswer.findIndex(answer => answer.questionId === parseInt(id, 10))
    if (findOption === -1) {
      return res.status(404).json({ message: 'The question is not found' })
    }

    preferredAnswer[findOption].answerId = aid;
    return res.status(201).json({ message: 'The preferred Answer has been choosen' });

  }


  static questionId(req) {
    return req.params.questionId;
  }

  static answerId(req) {
    return req.params.answerId;
  }

}

export default AnswerController;
