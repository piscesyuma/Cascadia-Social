import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ComponentType, JSX, useCallback, useEffect, useState } from "react";
import { EditorProps } from "react-draft-wysiwyg";

import { BackArrowIcon } from "@/assets/back-arrow-icon";
import { CloseIcon } from "@/assets/close-icon";
import { CloseButton } from "@/components/elements/close-button";

import { updateBio } from "../api/update-bio";
import { IBio, IUser } from "../types";

import styles from "./styles/edit-detail-modal.module.scss";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

let Editor: ComponentType<EditorProps> | null = null;

export const EditDetailModal = ({
  user,
  closeModal,
}: {
  user: IUser;
  closeModal: () => void;
}) => {
  const innerWidth = window.innerWidth;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ profile, userId }: { profile: IBio; userId: string }) => {
      return updateBio(profile, userId);
    },

    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
    onSettled: () => {
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ["users", user?.id] });
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty(),
  );
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [profile, setProfile] = useState<IBio>({
    detail: "",
  });

  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);
  };

  const handleSave = useCallback(() => {
    setIsLoading(true);

    mutation.mutate({ profile, userId: user.id });
  }, [mutation, profile, user.id]);

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const htmlVersion = stateToHTML(contentState);
    setProfile((prev) => ({ ...prev, detail: htmlVersion }));
  }, [editorState]);

  useEffect(() => {
    const editorContent = stateFromHTML(user.detail || ""); // convert to text
    const newState = EditorState.createWithContent(editorContent);
    const moveFocusState = EditorState.moveFocusToEnd(newState); // move cursor

    setEditorState(moveFocusState); // update state
  }, [user.detail]);

  useEffect(() => {
    Editor = dynamic<EditorProps>(
      () => import("react-draft-wysiwyg").then((module) => module.Editor),
      { loading: () => <p>Loading...</p>, ssr: false },
    );
    setEditorLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.2 }}
      className={styles.container}
    >
      <div className={styles.header}>
        <CloseButton
          onClick={() => closeModal()}
          ariaLabel={innerWidth <= 700 ? "Back" : "Close"}
          title={innerWidth <= 700 ? "Back" : "Close"}
        >
          {innerWidth <= 700 ? <BackArrowIcon /> : <CloseIcon />}
        </CloseButton>

        <h2>Edit Detail</h2>

        <button
          aria-label="Save"
          onClick={handleSave}
          disabled={isLoading || profile?.detail?.length === 0}
          className={styles.save}
        >
          {isLoading ? "Saving" : "Save"}
        </button>
      </div>

      <div className={styles.form}>
        {editorLoaded && Editor ? (
          <Editor
            editorState={editorState}
            wrapperClassName="detail-wrapper"
            editorClassName="detail-editor"
            toolbarClassName="detail-toolbar"
            onEditorStateChange={handleChange}
            toolbar={
              {
                // options: ["link"],
              }
            }
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </motion.div>
  );
};
