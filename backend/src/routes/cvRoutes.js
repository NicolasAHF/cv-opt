import express from 'express';
import multer from 'multer';
import { analyzeCV as analyzeCVController } from '../controllers/cvController.js';
import authenticate from '../middlewares/authenticate.js';
import { listCVs, getCVDetails, analyzeCVTrial  } from '../controllers/cvController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/analyze', authenticate, upload.single('cvFile'), analyzeCVController);

router.get('/list', authenticate, listCVs);

router.get('/:id', authenticate, getCVDetails);

router.post('/analyze/trial', upload.single('cvFile'), analyzeCVTrial);

export default router;
