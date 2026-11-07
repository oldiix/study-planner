import {useId, useState} from 'react'
import type {ChangeEvent, SubmitEvent} from 'react'
import type {CategoryColor, NewTask, Priority} from '../../types/task'
import './TaskForm.scss'

type TaskFormProps = {
    heading?: string
    submitLabel: string
    initialValues?: NewTask
    onSubmit: (task: NewTask) => void
    onCancel?: () => void
}

const categoryColors: CategoryColor[] = ['indigo', 'blue', 'green', 'orange', 'pink', 'gray']

const emptyForm: NewTask = {
    title: '',
    description: '',
    category: '',
    categoryColor: 'indigo',
    priority: 'medium',
}

export default function TaskForm({
                                     heading,
                                     submitLabel,
                                     initialValues = emptyForm,
                                     onSubmit,
                                     onCancel,
                                 }: TaskFormProps) {
    const id = useId()
    const [form, setForm] = useState<NewTask>(initialValues)
    const [error, setError] = useState('')

    function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
        setForm({...form, title: event.target.value})
        setError('')
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        const title = form.title.trim()
        if (!title) {
            setError('Title is required')
            return
        }

        onSubmit({
            title,
            description: form.description.trim(),
            category: form.category.trim() || 'General',
            categoryColor: form.categoryColor,
            priority: form.priority,
        })

        setForm(initialValues)
        setError('')
    }

    return (
        <form className="task-form" onSubmit={handleSubmit} noValidate>
            {heading && <h2 className="task-form__heading">{heading}</h2>}

            <div className="task-form__field">
                <label className="task-form__label" htmlFor={`${id}-title`}>
                    Title
                </label>
                <input
                    id={`${id}-title`}
                    type="text"
                    className={error ? 'task-form__input task-form__input--invalid' : 'task-form__input'}
                    placeholder="e.g. Learn React hooks"
                    value={form.title}
                    onChange={handleTitleChange}
                    aria-invalid={error !== ''}
                    aria-describedby={error ? `${id}-title-error` : undefined}
                />
                {error && (
                    <p id={`${id}-title-error`} className="task-form__error">
                        {error}
                    </p>
                )}
            </div>

            <div className="task-form__field">
                <label className="task-form__label" htmlFor={`${id}-description`}>
                    Description
                </label>
                <textarea
                    id={`${id}-description`}
                    className="task-form__input task-form__input--multiline"
                    rows={2}
                    placeholder="Short description"
                    value={form.description}
                    onChange={(event) => setForm({...form, description: event.target.value})}
                />
            </div>

            <div className="task-form__row">
                <div className="task-form__field">
                    <label className="task-form__label" htmlFor={`${id}-category`}>
                        Category
                    </label>
                    <input
                        id={`${id}-category`}
                        type="text"
                        className="task-form__input"
                        placeholder="e.g. React"
                        value={form.category}
                        onChange={(event) => setForm({...form, category: event.target.value})}
                    />
                </div>

                <div className="task-form__field">
                    <label className="task-form__label" htmlFor={`${id}-priority`}>
                        Priority
                    </label>
                    <select
                        id={`${id}-priority`}
                        className="task-form__input"
                        value={form.priority}
                        onChange={(event) => setForm({...form, priority: event.target.value as Priority})}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <fieldset className="task-form__colors">
                <legend className="task-form__label">Category color</legend>
                <div className="task-form__swatches">
                    {categoryColors.map((color) => (
                        <label key={color} className="task-form__swatch-option">
                            <input
                                type="radio"
                                name={`${id}-category-color`}
                                className="task-form__swatch-input"
                                value={color}
                                checked={form.categoryColor === color}
                                onChange={() => setForm({...form, categoryColor: color})}
                                aria-label={color}
                            />
                            <span className={`task-form__swatch task-form__swatch--${color}`}/>
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="task-form__actions">
                {onCancel && (
                    <button type="button" className="task-form__cancel" onClick={onCancel}>
                        Cancel
                    </button>
                )}
                <button type="submit" className="task-form__submit">
                    {submitLabel}
                </button>
            </div>
        </form>
    )
}