import express, {Application} from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import YAML from 'yamljs'
import swaggerUI from 'swagger-ui-express'
import { ParsedEnvVariables } from './config/env-variables'


const app: Application = express()
const swaggerSpec = YAML.load('./src/docs/swagger.yaml')

app.use(express.json())
app.use(cors({
    origin: ParsedEnvVariables.CORS_ORIGIN,
    credentials: true
}))
app.use(helmet())
app.use(cookieParser())

if(ParsedEnvVariables.NODE_ENV === 'development') {
    app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
}


export default app
