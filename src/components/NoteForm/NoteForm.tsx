import css from './NoteForm.module.css';
import type { NoteTag } from '../../types/note';
import { Field, Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export interface NoteFormValues{
    title: string,
    content: string,
    tag: NoteTag,
}

export interface NoteFormProps{
    onCancel: () => void,
    onSubmit: (values: NoteFormValues) => void,
    isSubmitting: boolean,
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Min 3 characters')
    .max(50, 'Max 50 characters')
    .required('Required'),
  content: Yup.string().max(500, 'Max 500 characters'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});

export default function NoteForm({onCancel, onSubmit, isSubmitting }: NoteFormProps){
    const initialValues: NoteFormValues = {
        title: '', 
        content: '', 
        tag: 'Todo',
    }
    return(
    <Formik initialValues = {initialValues} onSubmit={(values) => onSubmit(values)} 
    validationSchema={validationSchema}>
        {({ isValid, dirty }) => (
        <Form className = {css.form}>
            <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field type = "text" name = "title" id="title" className ={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} /></div>
            <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as = "textarea" name = "content" id="content" className = {css.textarea} rows={8} />
            <ErrorMessage name="content" component="span" className={css.error} /></div>
            <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" name="tag" id="tag" className={css.select}>
                <option value = "Todo">Todo</option>
                <option value = "Work">Work</option>
                <option value = "Personal">Personal</option>
                <option value = "Meeting">Meeting</option>
                <option value = "Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} /></div>
            <div className={css.actions}>
            <button type = "button" className={css.cancelButton} onClick = {onCancel} disabled = {isSubmitting}>
                Cancel</button> 
            <button type = "submit" className={css.submitButton} disabled={!dirty || !isValid || isSubmitting}>
               {isSubmitting ? 'Creating...' : 'Create note'}</button> </div>
        </Form>)}
     </Formik>
    );
}
