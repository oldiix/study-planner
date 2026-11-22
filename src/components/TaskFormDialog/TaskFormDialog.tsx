import {useEffect, useId, useRef, useState} from 'react'
import type {SyntheticEvent} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {taskSchema} from '../../schemas/taskSchema'
import type {TaskFormData} from '../../schemas/taskSchema'
import type {CategoryColor, Task} from '../../types/task'
import './TaskFormDialog.scss'

type TaskFormDialogProps = {
    open: boolean
    mode: 'create' | 'edit'
    task?: Task
    onClose: () => void
    onSubmit: (data: TaskFormData) => Promise<void>
}

const categoryColors: CategoryColor[] = ['indigo', 'blue', 'green', 'orange', 'pink', 'gray']

const emptyValues: TaskFormData = {
    title: '',
    description: '',
    category: '',
    categoryColor: 'indigo',
    priority: 'medium',
}

function toFormValues(task?: Task): TaskFormData {
    if (!task) {
        return emptyValues
    }

    return {
        title: task.title,
        description: task.description,
        category: task.category,
        categoryColor: task.categoryColor,
        priority: task.priority,
    }
}

function getInputClassName(hasError: boolean): string {
    return hasError ? 'task-form-dialog__input task-form-dialog__input--invalid' : 'task-form-dialog__input'
}

type TaskFormFieldsProps = {
    task?: Task
    submitLabel: string
    isPending: boolean
    onCancel: () => void
    onSubmit: (data: TaskFormData) => Promise<void>
}

function TaskFormFields({task, submitLabel, isPending, onCancel, onSubmit}: TaskFormFieldsProps) {
    const id = useId()
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: toFormValues(task),
    })

    return (
        <form className="task-form-dialog__form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="task-form-dialog__field">
                <label className="task-form-dialog__label" htmlFor={`${id}-title`}>
                    Title
                </label>
                <input
                    id={`${id}-title`}
                    type="text"
                    className={getInputClassName(Boolean(errors.title))}
                    placeholder="e.g. Learn React hooks"
                    aria-invalid={Boolean(errors.title)}
                    aria-describedby={errors.title ? `${id}-title-error` : undefined}
                    {...register('title')}
                />
                {errors.title && (
                    <p id={`${id}-title-error`} className="task-form-dialog__error" role="alert">
                        {errors.title.message}
                    </p>
                )}
            </div>

            <div className="task-form-dialog__field">
                <label className="task-form-dialog__label" htmlFor={`${id}-description`}>
                    Description
                </label>
                <textarea
                    id={`${id}-description`}
                    className={`${getInputClassName(Boolean(errors.description))} task-form-dialog__input--multiline`}
                    rows={3}
                    placeholder="Short description"
                    aria-invalid={Boolean(errors.description)}
                    aria-describedby={errors.description ? `${id}-description-error` : undefined}
                    {...register('description')}
                />
                {errors.description && (
                    <p id={`${id}-description-error`} className="task-form-dialog__error" role="alert">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="task-form-dialog__row">
                <div className="task-form-dialog__field">
                    <label className="task-form-dialog__label" htmlFor={`${id}-category`}>
                        Category
                    </label>
                    <input
                        id={`${id}-category`}
                        type="text"
                        className={getInputClassName(Boolean(errors.category))}
                        placeholder="e.g. React"
                        aria-invalid={Boolean(errors.category)}
                        aria-describedby={errors.category ? `${id}-category-error` : undefined}
                        {...register('category')}
                    />
                    {errors.category && (
                        <p id={`${id}-category-error`} className="task-form-dialog__error" role="alert">
                            {errors.category.message}
                        </p>
                    )}
                </div>

                <div className="task-form-dialog__field">
                    <label className="task-form-dialog__label" htmlFor={`${id}-priority`}>
                        Priority
                    </label>
                    <select
                        id={`${id}-priority`}
                        className={getInputClassName(Boolean(errors.priority))}
                        aria-invalid={Boolean(errors.priority)}
                        {...register('priority')}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    {errors.priority && (
                        <p className="task-form-dialog__error" role="alert">
                            {errors.priority.message}
                        </p>
                    )}
                </div>
            </div>

            <fieldset className="task-form-dialog__colors">
                <legend className="task-form-dialog__label">Category color</legend>
                <div className="task-form-dialog__swatches">
                    {categoryColors.map((color) => (
                        <label key={color} className="task-form-dialog__swatch-option">
                            <input
                                type="radio"
                                className="task-form-dialog__swatch-input"
                                value={color}
                                aria-label={color}
                                {...register('categoryColor')}
                            />
                            <span className={`task-form-dialog__swatch task-form-dialog__swatch--${color}`}/>
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="task-form-dialog__actions">
                <button type="button" className="task-form-dialog__cancel" onClick={onCancel} disabled={isPending}>
                    Cancel
                </button>
                <button type="submit" className="task-form-dialog__submit" disabled={isPending}>
                    {isPending ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default function TaskFormDialog({open, mode, task, onClose, onSubmit}: TaskFormDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const titleId = useId()
    const [isPending, setIsPending] = useState(false)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) {
            return
        }

        if (open && !dialog.open) {
            dialog.showModal()
        }
        if (!open && dialog.open) {
            dialog.close()
        }
    }, [open])

    function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
        // Escape fires "cancel": keep the dialog open while the request is running
        if (isPending) {
            event.preventDefault()
        }
    }

    async function handleSubmit(data: TaskFormData) {
        setIsPending(true)
        try {
            await onSubmit(data)
            onClose()
        } catch {
            // the error is already shown in a toast, keep the dialog open with the entered values
        } finally {
            setIsPending(false)
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="task-form-dialog"
            aria-labelledby={titleId}
            onCancel={handleCancel}
            onClose={onClose}
        >
            <h2 id={titleId} className="task-form-dialog__title">
                {mode === 'create' ? 'New task' : 'Edit task'}
            </h2>

            {open && (
                <TaskFormFields
                    task={task}
                    submitLabel={mode === 'create' ? 'Add task' : 'Save changes'}
                    isPending={isPending}
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                />
            )}
        </dialog>
    )
}
