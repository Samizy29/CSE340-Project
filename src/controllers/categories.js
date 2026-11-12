// Import any needed model functions
import { body, validationResult } from 'express-validator';
import {
    getAllCategories,
    getCategoryDetails,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

// Define validation rules
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryDetails(categoryId);

    // If the category does not exist, forward a 404 error
    if (!categoryDetails) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';

    res.render('category', { title, categoryDetails, projects });
};

const showNewCategoryForm = (req, res) => {
    const title = 'New Category';

    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await createCategory(req.body.name);
        req.flash('success', 'Category created successfully.');
        res.redirect(`/category/${categoryId}`);
    } catch (err) {
        // 23505 = unique violation (category names must be unique)
        if (err.code !== '23505') throw err;
        req.flash('error', 'A category with that name already exists.');
        res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res, next) => {
    const categoryDetails = await getCategoryDetails(req.params.id);

    // If the category does not exist, forward a 404 error
    if (!categoryDetails) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Edit Category';

    res.render('edit-category', { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(error => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        await updateCategory(categoryId, req.body.name);
        req.flash('success', 'Category updated successfully.');
        res.redirect(`/category/${categoryId}`);
    } catch (err) {
        if (err.code !== '23505') throw err;
        req.flash('error', 'A category with that name already exists.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

// Export any controller functions
export {
    categoryValidation,
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};