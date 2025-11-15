# Работа с обновлениями (updates) квестов

## Что такое обновления?

Обновления (updates) - это новости/посты о прогрессе квеста, которые публикует куратор проекта. Они отображаются в ленте обновлений внутри детальной страницы квеста.

## Структура обновления

```typescript
interface QuestUpdate {
  id: string
  date: string // ISO date
  title: string
  content: string
  images?: string[]
  video?: string
  author: string
  stageId?: string // Связь с этапом (опционально)
}
```

## Как работают обновления

### 1. Хранение

Обновления хранятся **внутри объекта квеста** в поле `updates`:

```typescript
interface Quest {
  id: string
  title: string
  // ... другие поля
  updates: QuestUpdate[] // Массив обновлений
}
```

### 2. Получение обновлений

Обновления **получаются автоматически** вместе с квестом:

#### Вариант 1: Через список квестов
```typescript
import { useGetQuestsQuery } from '@/store/entities/quest'

function QuestList() {
  const { data } = useGetQuestsQuery()
  
  // Каждый квест уже содержит массив updates
  data?.data.quests.forEach(quest => {
    console.log('Updates:', quest.updates)
  })
}
```

#### Вариант 2: Через один квест
```typescript
import { useGetQuestQuery } from '@/store/entities/quest'

function QuestDetails({ questId }: { questId: string }) {
  const { data } = useGetQuestQuery(questId)
  
  // Обновления уже в объекте квеста
  const updates = data?.data.quest.updates || []
}
```

#### Вариант 3: Статические данные
```typescript
import { quests } from '@/components/map/data/quests'

// В статических данных обновления пустые: updates: []
const quest = quests.find(q => q.id === 'quest-id')
const updates = quest?.updates || []
```

### 3. Отображение обновлений

Обновления отображаются в компоненте `QuestDetails` во вкладке "Обновления":

```typescript
// src/components/map/ui/quest/QuestDetails.tsx
{activeTab === 'updates' && (
  <div className='space-y-4'>
    {quest.updates.length === 0 ? (
      <p>Пока нет обновлений</p>
    ) : (
      quest.updates.map(update => (
        <div key={update.id}>
          <h4>{update.title}</h4>
          <p>{update.content}</p>
          {update.images && (
            <div>
              {update.images.map(img => (
                <img key={img} src={img} alt={update.title} />
              ))}
            </div>
          )}
        </div>
      ))
    )}
  </div>
)}
```

### 4. Создание обновлений

Обновления создаются через API endpoint `POST /quests/:questId/updates`:

```typescript
import { useCreateUpdateMutation } from '@/store/entities/quest'

function CreateUpdateForm({ questId }: { questId: string }) {
  const [createUpdate, { isLoading }] = useCreateUpdateMutation()
  
  const handleSubmit = async (formData: {
    title: string
    content: string
    images?: string[]
    video?: string
    stageId?: string
  }) => {
    try {
      const result = await createUpdate({
        questId,
        data: {
          title: formData.title,
          content: formData.content,
          images: formData.images,
          video: formData.video,
          stageId: formData.stageId, // Опционально - привязка к этапу
        }
      }).unwrap()
      
      // Обновление создано, кэш автоматически обновится
      console.log('Update created:', result.data.update)
      
      // Квест автоматически обновится в кэше
      // Можно сразу использовать обновленный квест
    } catch (error) {
      console.error('Error creating update:', error)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Форма для создания обновления */}
    </form>
  )
}
```

## Полный пример использования

```typescript
import { 
  useGetQuestQuery, 
  useCreateUpdateMutation 
} from '@/store/entities/quest'

function QuestUpdates({ questId }: { questId: string }) {
  // Получаем квест с обновлениями
  const { data: questData, isLoading } = useGetQuestQuery(questId)
  const [createUpdate, { isLoading: isCreating }] = useCreateUpdateMutation()
  
  const quest = questData?.data.quest
  const updates = quest?.updates || []
  
  const handleCreateUpdate = async () => {
    await createUpdate({
      questId,
      data: {
        title: 'Новое обновление',
        content: 'Мы достигли нового этапа!',
        images: ['https://example.com/photo.jpg'],
        stageId: 'stage-1', // Опционально
      }
    }).unwrap()
    
    // После создания обновления:
    // 1. Кэш автоматически обновится
    // 2. useGetQuestQuery вернет обновленный квест
    // 3. Компонент автоматически перерендерится с новыми данными
  }
  
  if (isLoading) return <div>Загрузка...</div>
  
  return (
    <div>
      <h2>Обновления ({updates.length})</h2>
      
      {/* Список обновлений */}
      {updates.length === 0 ? (
        <p>Пока нет обновлений</p>
      ) : (
        <div>
          {updates.map(update => (
            <article key={update.id}>
              <h3>{update.title}</h3>
              <p>{update.content}</p>
              <small>
                {new Date(update.date).toLocaleDateString()} • {update.author}
              </small>
              {update.images && (
                <div>
                  {update.images.map(img => (
                    <img key={img} src={img} alt={update.title} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      
      {/* Форма создания (только для куратора) */}
      {isCurator && (
        <button 
          onClick={handleCreateUpdate}
          disabled={isCreating}
        >
          {isCreating ? 'Создание...' : 'Добавить обновление'}
        </button>
      )}
    </div>
  )
}
```

## Кэширование

RTK Query автоматически управляет кэшем:

1. **При получении квеста** - обновления кэшируются вместе с квестом
2. **При создании обновления** - кэш автоматически инвалидируется:
   ```typescript
   invalidatesTags: ['QuestList', { type: 'Quest', id: questId }]
   ```
3. **Автоматическое обновление** - после создания обновления, все запросы к этому квесту вернут обновленные данные

## Важные моменты

### 1. Права доступа
- Только **куратор квеста** может создавать обновления
- API вернет ошибку `403` если пользователь не является куратором

### 2. Привязка к этапу
- Обновление можно привязать к конкретному этапу через `stageId`
- Это позволяет фильтровать обновления по этапам

### 3. Медиафайлы
- Поддерживаются изображения (`images: string[]`)
- Поддерживается видео (`video: string`)
- URL должны быть доступными

### 4. Автор
- Автор обновления определяется автоматически на сервере
- Используется информация из токена пользователя

## Локальное сохранение (устаревшее)

В старых версиях обновления могли сохраняться локально через `updateUserQuest()`:

```typescript
// УСТАРЕВШИЙ СПОСОБ
import { updateUserQuest } from '@/utils/userData'

const quest = getUserQuest(questId)
quest.updates.push(newUpdate)
updateUserQuest(quest) // Сохранение в localStorage
```

**Рекомендуется использовать API** для создания обновлений, так как:
- Данные синхронизируются между устройствами
- Есть проверка прав доступа
- Автоматическое обновление кэша
- Централизованное хранение

## API Endpoint

```
POST /quests/:questId/updates
Authorization: Bearer <token>

Body:
{
  "title": "Заголовок обновления",
  "content": "Текст обновления",
  "images": ["url1", "url2"],
  "video": "url",
  "stageId": "stage-id" // опционально
}

Response:
{
  "success": true,
  "data": {
    "update": { ... },
    "quest": { ... }, // Обновленный квест
    "message": "Обновление успешно создано"
  }
}
```

