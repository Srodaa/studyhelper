import { Button } from "@/components/templates/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/templates/dialog";
import { Label } from "@/components/templates/label";

const Statistics: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="cursor-pointer">Statistics</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border border-slate-600 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-center">Statistics</DialogTitle>
          <DialogDescription className="text-center">
            Here you can see some statistics on your time spent studying.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label className="text-right">Total time spent studying:</Label>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="submit" className="bg-white text-black hover:bg-slate-200 border border-slate-600">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Statistics;
