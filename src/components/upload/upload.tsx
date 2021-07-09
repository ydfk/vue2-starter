/*
 * Copyright (c) QJJS. All rights reserved.
 * ProjectName: bhikku.vue
 * FileName : upload.tsx
 * Author : liyuhang
 * Date : 2021-06-16 21:53:21
 */

import { defineComponent, reactive, computed, PropType } from "@vue/composition-api";
import { openErrorMsg } from "@/components/dialog/dialogCommon";
import { UploadFileModel, UploadRequestModel } from "@/commons/models/baseModel";
import { v4 as uuidv4 } from "uuid";
import { TableAction } from "@/components/table/tableModel";

export default defineComponent({
  components: {},
  props: {
    accept: { default: "", type: String },
    multiple: { default: false, type: Boolean },
    singleFileSize: { default: 5120, type: Number }, // 单个文件允许的文件最大size 单位为MB
    everyUploadFileCount: { default: 5, type: Number }, // 多文件上传时候每次文件数量
    totalFileCount: { default: 20, type: Number }, // 总文件数量
    listType: { default: "picture-card", type: String }, // 按钮样式
    showUploadList: { default: true, type: Boolean },
    beforeUpload: { type: Function as PropType<(files: UploadFileModel[]) => Promise<void>> },
  },
  setup(props, ctx) {
    const state = reactive({
      uploadedFiles: reactive<UploadFileModel[]>([]),
      slot: computed(() => {
        return ctx.slots && ctx.slots.default;
      }),
    });

    const checkFileType = (fileList: Array<UploadFileModel>) => {
      fileList.forEach((f) => {
        const typeArray = f.name.split(".");
        const [type, ...rest] = typeArray.reverse();
        f.extension = `.${type.toLowerCase()}`;
        f.id = uuidv4();
      });

      return true;
    };

    const beforeUpload = (file: UploadFileModel, fileList: Array<UploadFileModel>) => {
      return new Promise<void>((resolve, reject) => {
        if (!checkFileType(fileList)) {
          openErrorMsg(`只能上传[${props.accept}]类型的文件!`);
          reject();
        } else {
          if (fileList.length > props.everyUploadFileCount) {
            openErrorMsg(`每次最多允许上传${props.everyUploadFileCount}个文件!`);
            reject();
          } else {
            if (fileList.length + state.uploadedFiles.length > props.totalFileCount) {
              openErrorMsg(`最多只能上传${props.totalFileCount}个文件!`);
              reject();
            } else {
              const zeroSize = fileList.some((s) => s.size <= 0);
              if (zeroSize) {
                openErrorMsg(`文件大小不能为0`);
                reject();
              } else {
                const overMaxSize = fileList.some((s) => s.size / (1024 * 1024) > props.singleFileSize);
                if (overMaxSize) {
                  openErrorMsg(`文件大小不能超过${props.singleFileSize}MB!`);
                  reject();
                } else {
                  if (!props.beforeUpload) {
                    resolve();
                  } else {
                    const before = props.beforeUpload([file]);
                    if (before && before.then) {
                      before
                        .then(() => {
                          resolve();
                        })
                        .catch(() => {
                          reject();
                        });
                    } else {
                      resolve();
                    }
                  }
                }
              }
            }
          }
        }
      });
    };

    const customRequest = async (uploadRequest: UploadRequestModel) => {
      const file = uploadRequest.file;
      ////todo 需要实现后台上传方法
      if (file) {
        state.uploadedFiles.push(file);
        ctx.emit("change", state.uploadedFiles);
      }
    };

    ////todo 暂时不使用
    const remove = () => {};

    return () => {
      return (
        <div class="upload">
          <a-upload
            name={"Files"}
            multiple={props.multiple}
            beforeUpload={beforeUpload}
            customRequest={customRequest}
            remove={remove}
            listType={props.listType}
            showUploadList={props.showUploadList}
          >
            {(state.slot && state.slot()) || (
              <div>
                <a-icon class="uploadIcon" type="inbox" />
                <p class="ant-upload-text">单击或拖拽文件到此上传</p>
              </div>
            )}
          </a-upload>
        </div>
      );
    };
  },
});
