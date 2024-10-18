import {type FC} from 'react';

import {SendTransactionRequest, TonConnectButton, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {useFormik} from "formik";
import {Button, Card, Input, Textarea} from "@telegram-apps/telegram-ui";
import {array, object, string} from "yup";

const messageSchema = object().shape({
  address: string().required('Address is required'),
  amount: string().required('Amount is required'),
  payload: string().required('Payload is required'),
});

const transactionSchema = object().shape({
  validUntil: string().required('Valid until is required'),
  messages: array().of(messageSchema),
})

export const App: FC = () => {
  const wallet = useTonWallet()
  const [tonui] = useTonConnectUI()

  const formik = useFormik({
    initialValues: {
      validUntil: 360,
      messages: [
        {address: '', amount: '', payload: undefined},
      ]
    } as SendTransactionRequest,
    validationSchema: transactionSchema,
    onSubmit: async (values) => {
      await tonui.sendTransaction(values)
    }
  })

  const {validUntil, messages} = formik.values

  const handleAddMessageElement = () => {
    formik.setFieldValue('messages', [...messages, {address: '', amount: '', payload: undefined}])
  }
  const handleDeleteMessageElement = (i: number) => {
    formik.setFieldValue('messages', messages.filter((_, index) => index !== i))
  }


  return (
    <main className={'container main-page'}>
      <TonConnectButton className='ton-connect__button'/>
      <h1>Ton message builder</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <Input
            id={'validUntil'}
            name={'validUntil'}
            header={'Validation time, seconds'}
            status={formik.errors?.validUntil ? 'error' : 'default'}
            type="number"
            onChange={formik.handleChange}
            value={validUntil}
          />
          <h2>Messages elements:</h2>
        </div>
        <div className={'cards-wrapper'}>
          {messages.map((el, i) => {
            // @ts-ignore
            const getError = (name: string) => formik.errors?.messages?.[i]?.[name]

            return (<Card className={'card'} key={el.address + i} style={{minWidth: 600}}>
              <Input
                header={'Contract Address'}
                placeholder={'EQAWzEKcdnykvXfUNouqdS62tvrp32bCxuKS6eQrS6ISgcLo'}
                id={'address' + i}
                name={'address' + i}
                status={getError('address') ? 'error' : 'default'}
                onChange={(e) => formik.setFieldValue(`messages.${i}.address`, e.target.value)}
                value={el.address}
              />
              <Input
                header={'Amount - NanoTons'}
                placeholder={'1000000000'}
                id={'amount' + i}
                status={getError('amount') ? 'error' : 'default'}
                name={'amount' + i}
                onChange={(e) => formik.setFieldValue(`messages.${i}.amount`, e.target.value)}
                value={el.amount}
              />
              <Textarea
                header={'Payload - base64'}
                id={'payload' + i}
                name={'payload' + i}
                status={getError('payload') ? 'error' : 'default'}
                onChange={(e) => formik.setFieldValue(`messages.${i}.payload`, e.target.value)}
                value={el.payload}
                style={{resize: 'none', height: 300}}
              />

              <div className={'card-buttons'}>
                <Button onClick={handleAddMessageElement}>
                  Add
                </Button>
                <Button
                  style={{backgroundColor: 'rgba(248,64,64,0.86)', color: 'white'}}
                  onClick={() => handleDeleteMessageElement(i)}
                  disabled={i === 0}
                >
                  Delete
                </Button>
              </div>
            </Card>)
          })}
        </div>
        <Button style={{width: '100%', margin: '20px 0'}} onClick={formik.submitForm} disabled={!wallet?.account.address || !formik.isValid}>{!wallet?.account.address ? 'Connect wallet' : 'Send'}</Button>
      </form>
    </main>
  );
};
