import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageCircle, Send } from 'lucide-react'

export interface Message {
	id: string
	text: string
	timestamp: Date
	isUser: boolean
}

interface SupportChatContentProps {
	readonly messages: Message[]
	readonly message: string
	readonly setMessage: (message: string) => void
	readonly isSubmitting: boolean
	readonly onSend: () => void
	readonly onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void
	readonly formatTime: (date: Date) => string
}

export function SupportChatContent({
	messages,
	message,
	setMessage,
	isSubmitting,
	onSend,
	onKeyPress,
	formatTime,
}: SupportChatContentProps) {
	return (
		<>
			{/* Область сообщений */}
			<div className='flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 bg-gradient-to-br from-slate-50 to-blue-50/30 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
				{messages.length === 0 ? (
					<div className='flex flex-col items-center justify-center h-full text-center py-8'>
						<div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4'>
							<MessageCircle className='h-8 w-8 text-blue-600' />
						</div>
						<p className='text-slate-600 font-medium mb-2'>
							Добро пожаловать в чат поддержки!
						</p>
						<p className='text-sm text-slate-500 max-w-xs'>
							Задайте свой вопрос, и наша команда поддержки поможет вам
						</p>
					</div>
				) : (
					<div className='space-y-4'>
						{messages.map(msg => (
							<div
								key={msg.id}
								className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[80%] rounded-2xl px-4 py-3 ${
										msg.isUser
											? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white'
											: 'bg-white text-slate-900 border border-slate-200'
									}`}
								>
									<p className='text-sm leading-relaxed'>{msg.text}</p>
									<p
										className={`text-xs mt-1.5 ${
											msg.isUser ? 'text-white/70' : 'text-slate-500'
										}`}
									>
										{formatTime(msg.timestamp)}
									</p>
								</div>
							</div>
						))}
						{isSubmitting && (
							<div className='flex justify-start'>
								<div className='bg-white text-slate-900 border border-slate-200 rounded-2xl px-4 py-3'>
									<div className='flex gap-1'>
										<span className='w-2 h-2 bg-slate-400 rounded-full animate-bounce' />
										<span
											className='w-2 h-2 bg-slate-400 rounded-full animate-bounce'
											style={{ animationDelay: '0.2s' }}
										/>
										<span
											className='w-2 h-2 bg-slate-400 rounded-full animate-bounce'
											style={{ animationDelay: '0.4s' }}
										/>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Форма ввода */}
			<div className='px-4 py-4 bg-white border-t border-slate-200 flex-shrink-0'>
				<div className='flex gap-2'>
					<div className='flex-1'>
						<Label htmlFor='support-message' className='sr-only'>
							Ваше сообщение
						</Label>
						<Input
							id='support-message'
							value={message}
							onChange={e => setMessage(e.target.value)}
							onKeyPress={onKeyPress}
							placeholder='Введите ваше сообщение...'
							disabled={isSubmitting}
							className='rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500'
						/>
					</div>
					<Button
						type='button'
						onClick={onSend}
						disabled={!message.trim() || isSubmitting}
						className='rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 shadow-md hover:shadow-lg transition-all'
					>
						<Send className='h-4 w-4' />
					</Button>
				</div>
				<p className='text-xs text-slate-500 mt-2 text-center'>
					Обычно мы отвечаем в течение нескольких минут
				</p>
			</div>
		</>
	)
}
