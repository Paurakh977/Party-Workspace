import React from "react";

interface CommitteeFormProps {
  committeeName: string;
  onCommitteeNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CommitteeForm: React.FC<CommitteeFormProps> = ({
  committeeName,
  onCommitteeNameChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">समितिको नाम:</h3>
      </div>
      <div className="p-7">
        <form onSubmit={onSubmit}>
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="committeeName"
            >
              समितिको नाम प्रबिष्टि गर्नुहोस्
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-4">
                {/* Insert SVG Icon here if needed */}
              </span>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="committeeName"
                id="committeeName"
                placeholder="नाम यहाँ लेख्नुहोस्"
                value={committeeName}
                onChange={onCommitteeNameChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4.5">
            <button
              type="button"
              onClick={onCancel}
              className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black transition hover:shadow-md dark:border-strokedark dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-white transition hover:bg-opacity-90"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommitteeForm;
