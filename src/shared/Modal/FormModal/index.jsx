import React, { useCallback, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Modal from '../index';
import uuid from 'draft-js/lib/uuid';

const FormValidatedModal = ({
  children,
  handleClose,
  handleSubmit: onSubmitCallback,
  defaultValues = {},
  ...props
}) => {
  const methods = useForm({
    defaultValues,
    mode: 'onTouched', // Изменяем режим валидации
    reValidateMode: 'onChange',
  });

  const isSubmitClicked = useRef(false);
  const [isSubmitClickedState,setSubmitClickedState] = useState(false)
  const {
    handleSubmit,
    formState: { isValid, errors, touchedFields },
    trigger,
  } = methods;

  const onSubmit = useCallback(
    async (data, e) => {

        await trigger().then((isFormValid)=>{
            if (isFormValid) {
                setSubmitClickedState(true)

                onSubmitCallback(()=>{
                    setSubmitClickedState(false)
                });
            } else {
                setSubmitClickedState(false)

                e?.preventDefault();
            }
        })
        // try {
        //
        //     const isFormValid = await trigger();
        //
        //     if (isFormValid) {
        //         isSubmitClicked.current = true;
        //
        //         onSubmitCallback(data);
        //     } else {
        //         isSubmitClicked.current = false;
        //
        //         e?.preventDefault();
        //     }
        // }
        // catch (e){
        //
        //     isSubmitClicked.current = false
        //     throw e
        // }
    },
    [onSubmitCallback, trigger],
  );

    const handleSubmitWithTryCatch = () => {
        return handleSubmit(onSubmit);
    };

  return (
    <FormProvider {...methods}>
      <Modal
        {...props}
        handleClose={handleClose}
        handleSubmit={handleSubmitWithTryCatch()}
        isSubmitClicked={isSubmitClickedState}
      >
        <form id={uuid()} onSubmit={(e) => e.preventDefault()}>
          {children}
        </form>
      </Modal>
    </FormProvider>
  );
};

export default FormValidatedModal;
