# Работа с квестами

## Текущая архитектура

### 1. Статические данные (локальные)
Квесты хранятся в статическом файле:
- `src/components/map/data/quests.ts` - массив всех квестов

### 2. Пользовательские квесты (localStorage)
Пользовательские квесты сохраняются локально:
- `src/utils/userData.ts` - функции для работы с localStorage
- `getUserCreatedQuests()` - загрузка квестов из localStorage
- `saveUserQuest()` - сохранение квеста в localStorage

### 3. API сервис (новый)
RTK Query сервис для работы с API:
- `src/store/entities/quest/model/quest-service.ts` - все endpoints
- `src/store/entities/quest/model/type.ts` - типы для запросов/ответов

## Как работает получение квестов

### Вариант 1: Статические данные (текущий)
```typescript
import { quests } from '@/components/map/data/quests'
import { getAllQuests } from '@/utils/userData'

// Получить все квесты (статические + пользовательские)
const allQuests = getAllQuests(quests)
```

### Вариант 2: Через API (новый)
```typescript
import { useGetQuestsQuery } from '@/store/entities/quest'

function QuestList() {
  // Получить все квесты с сервера
  const { data, isLoading, error } = useGetQuestsQuery()
  
  // С фильтрацией
  const { data } = useGetQuestsQuery({
    city: 'Москва',
    category: 'environment',
    status: 'active',
    page: 1,
    limit: 20
  })
  
  return <div>{data?.data.quests.map(...)}</div>
}
```

## Как работает сохранение квестов

### Вариант 1: Локальное сохранение (текущий)
```typescript
import { saveUserQuest } from '@/utils/userData'

// Сохранить квест в localStorage
saveUserQuest(newQuest)
```

### Вариант 2: Через API (новый)
```typescript
import { useCreateQuestMutation } from '@/store/entities/quest'

function CreateQuestForm() {
  const [createQuest, { isLoading }] = useCreateQuestMutation()
  
  const handleSubmit = async (formData) => {
    try {
      const result = await createQuest({
        title: formData.title,
        city: formData.city,
        // ... остальные поля
      }).unwrap()
      
      // Квест создан на сервере
      console.log('Quest created:', result.data.quest)
    } catch (error) {
      console.error('Error:', error)
    }
  }
}
```

## Доступные endpoints

### Получение квестов
- `useGetQuestsQuery(params?)` - список квестов с фильтрацией
- `useLazyGetQuestsQuery()` - ленивая загрузка
- `useGetQuestQuery(questId)` - один квест по ID
- `useLazyGetQuestQuery()` - ленивая загрузка одного квеста

### Создание/обновление
- `useCreateQuestMutation()` - создать квест
- `useUpdateQuestMutation()` - обновить квест
- `useDeleteQuestMutation()` - удалить квест

### Участие в квестах
- `useParticipateMutation()` - присоединиться к квесту
- `useContributeMutation()` - внести вклад (донат/волонтерство)
- `useRegisterVolunteerMutation()` - зарегистрироваться на событие
- `useCreateUpdateMutation()` - добавить обновление к квесту

## Кэширование

RTK Query автоматически кэширует данные:
- Квесты кэшируются по тегам `['Quest', 'QuestList']`
- При создании/обновлении/удалении кэш автоматически обновляется
- Кэш инвалидируется при мутациях (participate, contribute и т.д.)

## Миграция

Для перехода с локальных данных на API:

1. Замените импорты статических данных на хуки RTK Query
2. Используйте `useGetQuestsQuery()` вместо `getAllQuests(quests)`
3. Используйте `useCreateQuestMutation()` вместо `saveUserQuest()`
4. Обновите компоненты для работы с асинхронными данными

## Пример использования

```typescript
import { useGetQuestsQuery, useParticipateMutation } from '@/store/entities/quest'

function QuestComponent() {
  // Загрузка квестов
  const { data, isLoading } = useGetQuestsQuery({ status: 'active' })
  const [participate, { isLoading: isParticipating }] = useParticipateMutation()
  
  const handleParticipate = async (questId: string) => {
    try {
      await participate({ questId, role: 'volunteer' }).unwrap()
      // Кэш автоматически обновится
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      {data?.data.quests.map(quest => (
        <div key={quest.id}>
          <h3>{quest.title}</h3>
          <button 
            onClick={() => handleParticipate(quest.id)}
            disabled={isParticipating}
          >
            Присоединиться
          </button>
        </div>
      ))}
    </div>
  )
}
```

