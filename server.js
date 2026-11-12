import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import { fileURLToPath } from 'url';
import path from 'path';
import router from './src/routes.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Parse form data submitted with POST requests
app.use(express.urlencoded({ extended: true }));

// Sessions and flash messages
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Make flash messages available to every view
app.use((req, res, next) => {
    res.locals.flash = req.flash();
    next();
});

/**
 * Routes
 */
app.use(router);

// Catch requests that matched no route and forward them as a 404
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;
    const template = status === 404 ? 'errors/404' : 'errors/500';
    const title = status === 404 ? 'Page Not Found' : 'Server Error';

    if (status !== 404) {
        console.error(err);
    }

    res.status(status).render(template, {
        title,
        // Only show technical details while developing
        error: NODE_ENV === 'development' ? err.stack : null
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});