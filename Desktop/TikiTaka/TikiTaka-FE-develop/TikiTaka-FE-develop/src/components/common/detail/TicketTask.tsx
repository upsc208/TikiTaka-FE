import {useCallback, useEffect, useMemo, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {createSubtask, deleteSubtask, getSubtasks, updateSubtaskDescription, updateSubtaskStatus} from '../../../api/service/subtasks';
import {useParams} from 'react-router-dom';
import {WhiteCheckIcon} from '../Icon';
import DOMPurify from 'dompurify';

export default function TicketTask({progress = 0}: {progress?: number}) {
  const [inputValue, setInputValue] = useState('');
  const [editedContent, setEditedContent] = useState<string>(''); // 1. 타입 명시적 선언
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const {id} = useParams();
  const ticketId = Number(id);
  const queryClient = useQueryClient();

  // 하위 태스크 조회
  const {data: tasks = []} = useQuery({
    queryKey: ['subtasks', ticketId],
    queryFn: () => getSubtasks(ticketId),
  });
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // 하위 태스크 작성
  const createSubtaskMutation = useMutation({
    mutationFn: createSubtask,
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({queryKey: ['subtasks', ticketId]});
      setLocalTasks((prev) => [...prev, newTask]);
    },
    onError: () => {
      alert('하위 태스크 추가에 실패했습니다. 다시 시도해 주세요.');
    },
  });
  //하위 태스크 상태 변경
  const updateSubtaskStatusMutation = useMutation({
    mutationFn: ({taskId, checked}: {taskId: number; checked: boolean}) => updateSubtaskStatus(ticketId, taskId, checked),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({queryKey: ['subtasks', ticketId]});
      queryClient.invalidateQueries({queryKey: ['ticketDetails', ticketId]});
      // 로컬 상태 즉시 업데이트
      setLocalTasks((prevTasks) =>
        prevTasks.map((task) => (task.subtaskId === variables.taskId ? {...task, done: variables.checked} : task))
      );
    },
    onError: () => {
      alert('하위 태스크 상태 업데이트에 실패했습니다.');
    },
  });

  // 하위 태스크 수정
  const updateSubtaskMutation = useMutation({
    mutationFn: ({taskId, description}: {taskId: number; description: string}) => updateSubtaskDescription(taskId, {description}),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['subtasks', ticketId]});
      setEditingTaskId(null);
      setEditedContent(''); // 2. 성공 시 내용 초기화
    },
  });

  // 하위 태스크 삭제
  const deleteSubtaskMutation = useMutation({
    mutationFn: (taskId: number) => deleteSubtask(ticketId, taskId),
    onSuccess: (_, deletedTaskId) => {
      queryClient.invalidateQueries({queryKey: ['subtasks', ticketId]});
      setLocalTasks((prev) => prev.filter((task) => task.subtaskId !== deletedTaskId));
    },
  });

  const handleStatusChange = useCallback(
    (subtaskId: number, checked: boolean) => {
      updateSubtaskStatusMutation.mutate({taskId: subtaskId, checked});
      // 즉시 로컬 상태 업데이트
      setLocalTasks((prevTasks) => prevTasks.map((task) => (task.subtaskId === subtaskId ? {...task, done: checked} : task)));
    },
    [updateSubtaskStatusMutation]
  );

  const handleEdit = (taskId: number, currentContent: string) => {
    setEditingTaskId(taskId);
    setEditedContent(currentContent);
  };

  const handleSave = (taskId: number) => {
    if (editedContent && editedContent.trim()) {
      updateSubtaskMutation.mutate({
        taskId,
        description: editedContent,
      });
    }
  };
  const handleCancel = () => {
    setEditingTaskId(null);
    setEditedContent('');
  };

  const handleDelete = (taskId: number) => {
    deleteSubtaskMutation.mutate(taskId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing) return; // IME 입력 중이면 무시
    if (event.key === 'Enter' && inputValue.trim()) {
      const newTaskParams: CreateSubtaskParams = {
        ticketId,
        description: inputValue,
      };
      createSubtaskMutation.mutate(newTaskParams);
      setInputValue('');
      event.preventDefault();
    }
  };

  const progressPercentage = useMemo(() => {
    if (localTasks.length === 0) return 0;
    const completedTasks = localTasks.filter((task) => task.done).length;
    return Math.round((completedTasks / localTasks.length) * 100);
  }, [localTasks]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-body-bold">Task</label>
        <label className="text-body-bold">
          Progress: <span className="text-main2-3">{Math.round(progress) || progressPercentage}%</span>
        </label>
      </div>

      <div className="relative w-full  p-5 border border-gray-2 rounded-[4px] bg-white text-subtitle-regular text-gray-15">
        <ul className="mt-2">
          <AnimatePresence>
            {localTasks.map((task, index) => (
              <motion.li
                key={index}
                initial={{opacity: 0, y: 5}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, ease: 'easeOut'}}
                className="bg-main text-white rounded-md p-3 my-2"
              >
                <div className="w-full flex items-center justify-between mb-2">
                  {/* 태스크 완료 섹션 */}
                  <section className="flex gap-3 items-center mr-4">
                    <label
                      className={`flex items-center justify-center w-4 h-4 border rounded-md cursor-pointer border-gray-2
                        ${task.done ? 'bg-main ' : ' '}`}
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => handleStatusChange(task.subtaskId, !task.done)}
                        className="hidden"
                      />
                      {task.done && <WhiteCheckIcon />}
                    </label>
                    <p className={`text-white text-body-regular`}>완료</p>
                  </section>

                  <section>
                    <div className="flex gap-1 text-gray-3 text-body-regular ">
                      {editingTaskId === task.subtaskId ? (
                        <>
                          <button className="hover:text-gray-5" onClick={() => handleSave(task.subtaskId)}>
                            저장
                          </button>
                          <button className="hover:text-gray-5" onClick={handleCancel}>
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(task.subtaskId, task.description)} className="hover:text-gray-5 ">
                            편집
                          </button>
                          <button onClick={() => handleDelete(task.subtaskId)} className="hover:text-gray-5">
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </section>
                </div>
                {editingTaskId === task.subtaskId ? (
                  <textarea
                    className="w-full p-2 border rounded text-main"
                    value={editedContent}
                    onChange={(e) => setEditedContent(DOMPurify.sanitize(e.target.value))}
                    style={{resize: 'none'}} // 크기 조절 비활성화
                  />
                ) : (
                  <p className={task.done ? 'line-through' : ''}>{task.description}</p>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <textarea
          className="w-full h-[78px] text-subtitle-regular border border-gray-2 rounded-[4px] py-3 px-4 focus:border-main resize-none"
          placeholder="하위 태스크 추가"
          value={inputValue}
          onChange={(e) => setInputValue(DOMPurify.sanitize(e.target.value))}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
