import app from './app';
import { generalLogger } from './utils/loggers';

const port = process.env.PORT || 3000;

app.listen(port, () => {
    generalLogger.info(`Server is running at http://localhost:${port}`);
});

