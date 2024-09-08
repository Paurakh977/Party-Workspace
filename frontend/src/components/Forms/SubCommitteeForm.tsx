import React from "react";

interface Committee {
  id: string;
  name: string;
}

interface SubCommitteeFormProps {
  subCommitteeName: string;
  selectedCommitteeId: string;
  committees: Committee[];
  isSubCommitteeEnabled: boolean;
  onSubCommitteeChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const SubCommitteeForm: React.FC<SubCommitteeFormProps> = ({
  subCommitteeName,
  selectedCommitteeId,
  committees,
  isSubCommitteeEnabled,
  onSubCommitteeChange,
  onCancel,
  onSubmit,
}) => {
  if (committees.length === 0) {
    return (
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            समिति उपलब्ध छैन
          </h3>
        </div>
        <div className="p-7">
          <p className="text-black dark:text-white">
            समिति डेटा उपलब्ध नभएकाले यो फारम हाललाई निष्क्रिय गरिएको छ।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">
          उपसमितिको नाम:
        </h3>
      </div>
      <div className="p-7">
        <form onSubmit={onSubmit}>
          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="subCommitteeName"
            >
              उपसमितिको नाम प्रबिष्टि गर्नुहोस्
            </label>
            <div className="relative">
              <span className="absolute left-4.5 top-4">
                {/* Insert SVG Icon here if needed */}
              </span>
              <input
                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                type="text"
                name="subCommitteeName"
                id="subCommitteeName"
                placeholder="उपसमिति नाम यहाँ लेख्नुहोस्"
                value={subCommitteeName}
                onChange={onSubCommitteeChange}
                disabled={!isSubCommitteeEnabled}
                required
              />
            </div>
          </div>

          <div className="mb-5.5">
            <label
              className="mb-3 block text-sm font-medium text-black dark:text-white"
              htmlFor="selectedCommitteeId"
            >
              समिति चयन गर्नुहोस्
            </label>
            <select
              className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-4.5 text-black focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              name="selectedCommitteeId"
              id="selectedCommitteeId"
              value={selectedCommitteeId}
              onChange={onSubCommitteeChange}
              disabled={!isSubCommitteeEnabled}
              required
            >
              <option value="" disabled>
                समिति चयन गर्नुहोस्
              </option>
              {committees.map((committee) => (
                <option key={committee.id} value={committee.id}>
                  {committee.name}
                </option>
              ))}
            </select>
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
              className={`flex justify-center rounded bg-primary px-6 py-2 font-medium text-white transition ${
                isSubCommitteeEnabled
                  ? "hover:bg-opacity-90"
                  : "cursor-not-allowed opacity-50"
              }`}
              disabled={!isSubCommitteeEnabled}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubCommitteeForm;
